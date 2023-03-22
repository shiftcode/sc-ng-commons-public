// tslint:disable:no-console
import { Inject, Injectable, Optional } from '@angular/core'
import {
  CloudWatchLogsClient,
  CreateLogStreamCommand,
  DescribeLogStreamsCommand,
  DescribeLogStreamsCommandOutput,
  InputLogEvent,
  PutLogEventsCommand,
  PutLogEventsResponse,
} from '@aws-sdk/client-cloudwatch-logs'
import { ClientIdService, LogLevel, LogRequestInfoProvider } from '@shiftcode/ngx-core'
import { getEnumKeyFromNum, jsonMapSetStringifyReplacer } from '@shiftcode/utilities'
import { Observable, of, ReplaySubject, Subject, throwError, timer } from 'rxjs'
import {
  buffer,
  catchError,
  filter,
  first,
  map,
  mergeMap,
  retryWhen,
  shareReplay,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators'
import { CLOUD_WATCH_LOG_TRANSPORT_CONFIG } from './cloud-watch-log-transport-config.injection-token'
import { CloudWatchLogTransportConfig } from './cloud-watch-log-transport-config.model'
import {
  isDataAlreadyAcceptedException,
  isError,
  isInvalidSequenceTokenException,
  isResourceAlreadyExistsException,
} from './is-error.function'
import { LogStreamNotExisting } from './log-stream-not-existing-error'

/*
 * The role needs to have minimal permissions on the log group
 * -----
 *   Action:
 *   - "logs:CreateLogStream"
 *   - "logs:PutLogEvents"
 *   - "logs:DescribeLogStreams"
 * ----
 */

/**
 * Service to send messages to CloudWatch
 * requires the {@link CLOUD_WATCH_LOG_TRANSPORT_CONFIG} to be provided
 */
@Injectable({ providedIn: 'root' })
export class CloudWatchService {
  // max request per second per log stream
  private static CLOUD_WATCH_RATE_LIMIT = 1000 / 5

  private readonly client$: Observable<CloudWatchLogsClient>
  private readonly logsSubject = new Subject<InputLogEvent>()
  private readonly sequenceTokenSubject = new ReplaySubject<string | undefined>(1)
  private readonly clientId: string
  private readonly jsonStringifyReplacer: (key: string, value: any) => any

  private get getPublishNextSequenceToken$(): Observable<void> {
    return this.client$.pipe(
      first(),
      switchMap(this.getNextSequenceToken),
      tap((v) => this.sequenceTokenSubject.next(v)),
      map(() => <void>undefined),
    )
  }

  constructor(
    clientIdService: ClientIdService,
    @Inject(CLOUD_WATCH_LOG_TRANSPORT_CONFIG) private readonly config: CloudWatchLogTransportConfig,
    @Optional() private logRequestInfoProvider?: LogRequestInfoProvider,
  ) {
    this.clientId = clientIdService.clientId
    this.jsonStringifyReplacer = config.jsonStringifyReplacer || jsonMapSetStringifyReplacer
    // no instantiation if LogLevel === OFF
    if (config.logLevel !== LogLevel.OFF) {
      // validation
      if (config.flushInterval <= CloudWatchService.CLOUD_WATCH_RATE_LIMIT) {
        throw new Error(
          `Flush interval must be greater than ${CloudWatchService.CLOUD_WATCH_RATE_LIMIT}ms --> CloudWatch Rate Limit`,
        )
      }

      // configure cloudwatch client once credentials are ready
      this.client$ = this.config.clientConfig$.pipe(
        map((clientConfig) => new CloudWatchLogsClient(clientConfig)),
        // try to create the log stream
        mergeMap(clientIdService.createdInThisSession ? this.tryCreateLogStream : this.tryDescribeOrCreateLogStream),
        // should only happen once AND should return value immediately
        shareReplay(1),
      )
      this.client$.subscribe({
        error: (err) => console.error('could not create CloudWatchLogsClient', err),
      })
      this.setup()
    }
  }

  /**
   * add message to the queue to send to CloudWatch Service
   * only send when {@link CloudWatchLogTransportConfig#logLevel} is not {@link LogLevel#OFF }
   */
  addMessage(level: LogLevel, context: string, dTimestamp: Date, args: any[]) {
    // do nothing if LogLevel === OFF
    if (this.config.logLevel !== LogLevel.OFF) {
      const logDataObject: Record<string, any> = {
        level: getEnumKeyFromNum(LogLevel, level),
        context,
        requestInfo: this.logRequestInfoProvider ? this.logRequestInfoProvider.getRequestInfo() : {},
      }

      if (isError(args[0])) {
        const err: Error = args.shift()
        logDataObject.message = `${err.name}: ${err.message}`
        // error case
        if ('stack' in err) {
          logDataObject.error = err['stack']
        }
      } else if (typeof args[0] === 'string') {
        logDataObject.message = args.shift()
      }
      if (args.length > 0) {
        logDataObject.data = args.length === 1 ? args[0] : args
      }

      this.logsSubject.next({
        message: JSON.stringify(logDataObject, this.jsonStringifyReplacer),
        timestamp: dTimestamp.getTime(),
      })
    }
  }

  private setup() {
    // actual log subscription
    this.logsSubject
      .pipe(
        // buffer logs --> wait for first setup to complete - then schedule forever
        buffer(
          this.client$.pipe(
            first(),
            mergeMap(() => timer(0, this.config.flushInterval)),
          ),
        ),
        // only none empty arrays
        filter((logEvents) => logEvents?.length > 0),
        // put logs to cloudwatch
        mergeMap(this.putLogEvents),
      )
      .subscribe({ error: console.error.bind(console) })
  }

  private tryDescribeOrCreateLogStream = async (client: CloudWatchLogsClient): Promise<CloudWatchLogsClient> => {
    try {
      const nextSequenceToken = await this.getNextSequenceToken(client)
      this.sequenceTokenSubject.next(nextSequenceToken)
      return client
    } catch (err) {
      if (err instanceof LogStreamNotExisting) {
        // it's important to await promise here to catch potential errors
        return this.tryCreateLogStream(client)
      }
      throw err
    }
  }

  private readonly tryCreateLogStream = async (client: CloudWatchLogsClient): Promise<CloudWatchLogsClient> => {
    try {
      // it's important to await promise here to catch potential errors
      await client.send(
        new CreateLogStreamCommand({
          logGroupName: this.config.logGroupName,
          logStreamName: this.clientId,
        }),
      )
      return client
    } catch (err) {
      // ignore error when stream is already created -->
      // doing it on inner observable let's the whole stream continue on error
      if (isResourceAlreadyExistsException(err)) {
        console.debug(`Cloudwatch Logstream '${this.clientId}' already exists. ignoring.`)
        return client
      } else {
        console.error('unable to initialize CloudWatch logger, see error for details')
        throw err
      }
    }
  }

  private readonly getNextSequenceToken = async (client: CloudWatchLogsClient): Promise<string | undefined> => {
    const cmd = new DescribeLogStreamsCommand({
      limit: 1,
      logGroupName: this.config.logGroupName,
      logStreamNamePrefix: this.clientId,
    })
    const res: DescribeLogStreamsCommandOutput = await client.send(cmd)
    if (!res || !res.logStreams || res.logStreams.length === 0) {
      throw new LogStreamNotExisting(`${this.config.logGroupName}:${this.clientId}`)
    }
    // uploadSequenceToken is undefined for the first time (after creating a new logStream)
    return res.logStreams[0].uploadSequenceToken
  }

  private readonly putLogEvents = (events: InputLogEvent[]): Observable<PutLogEventsResponse | void> => {
    // outer observable only for retry logic -- see below
    return of(<void>undefined).pipe(
      withLatestFrom(this.client$, this.sequenceTokenSubject),
      map(([_, state, sequenceToken]) => [state, sequenceToken, events] as const),
      // call to cloudwatch
      mergeMap(this.sendPutLogEventsCommand),
      // store next sequence token
      tap((data) => this.sequenceTokenSubject.next(data.nextSequenceToken)),
      // on certain error get next sequence token and retry otherwise abort retry
      retryWhen((errors) => {
        return errors.pipe(
          switchMap((err: unknown) => {
            if (isDataAlreadyAcceptedException(err) || isInvalidSequenceTokenException(err)) {
              if (err.expectedSequenceToken) {
                this.sequenceTokenSubject.next(err.expectedSequenceToken)
                return of(<void>undefined)
              } else {
                // get next token
                return this.getPublishNextSequenceToken$
              }
            } else {
              // abort and exit retry
              return throwError(<any>err)
            }
          }),
        )
      }),
      // we catch and ignore all errors
      catchError((err) => {
        console.warn(
          'unable to put logs or get next sequence token to/from CloudWatch --> we try again with the next batch',
          err,
        )
        return of(void 0)
      }),
    )
  }

  private readonly sendPutLogEventsCommand = ([client, sequenceToken, events]: readonly [
    CloudWatchLogsClient,
    string | undefined,
    InputLogEvent[],
  ]) => {
    return client.send(
      new PutLogEventsCommand({
        logEvents: events,
        logGroupName: this.config.logGroupName,
        logStreamName: this.clientId,
        sequenceToken,
      }),
    )
  }
}
