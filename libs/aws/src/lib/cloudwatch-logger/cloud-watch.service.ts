/* eslint-disable no-console */
import { Inject, Injectable, Optional } from '@angular/core'
import { ClientIdService, LogRequestInfoProvider, RemoteLogData } from '@shiftcode/ngx-core'
import { createJsonLogObjectData, LogLevel } from '@shiftcode/logger'
import { jsonMapSetStringifyReplacer } from '@shiftcode/utilities'
import { Observable, of, Subject, throwError } from 'rxjs'
import { catchError, filter, first, map, mergeMap, shareReplay, withLatestFrom } from 'rxjs/operators'
import { CLOUD_WATCH_LOG_TRANSPORT_CONFIG } from './cloud-watch-log-transport-config.injection-token'
import { CloudWatchLogTransportConfig } from './cloud-watch-log-transport-config.model'
import { InputLogEvent } from '@aws-sdk/client-cloudwatch-logs'
import { HttpClient } from '@angular/common/http'

type CloudWatchLogEvent = InputLogEvent & { logStreamName: string }

/**
 * Service to send messages to CloudWatch via APIGateway
 * requires the {@link CLOUD_WATCH_LOG_TRANSPORT_CONFIG} to be provided
 */
@Injectable({ providedIn: 'root' })
export class CloudWatchService {
  private readonly logStream$ = new Observable<void>()
  private readonly logsSubject = new Subject<CloudWatchLogEvent>()
  private readonly clientId: string
  private readonly jsonStringifyReplacer: (key: string, value: any) => any

  constructor(
    private httpClient: HttpClient,
    clientIdService: ClientIdService,
    @Inject(CLOUD_WATCH_LOG_TRANSPORT_CONFIG) private readonly config: CloudWatchLogTransportConfig,
    @Optional() private logRequestInfoProvider?: LogRequestInfoProvider,
  ) {
    this.clientId = clientIdService.clientId
    this.jsonStringifyReplacer = config.jsonStringifyReplacer || jsonMapSetStringifyReplacer
    // no instantiation if LogLevel === OFF
    if (this.config.logLevel === LogLevel.OFF) {
      return
    }
    this.logStream$.pipe(
      filter(() => clientIdService.createdInThisSession),
      mergeMap(this.createLogStream),
      shareReplay(1),
    )
    this.setup()
  }

  /**
   * add message to the queue to send to CloudWatch Service
   * only send when {@link CloudWatchLogTransportConfig#logLevel} is not {@link LogLevel#OFF }
   */
  addMessage(level: LogLevel, context: string, dTimestamp: Date, args: any[]) {
    // do nothing if LogLevel === OFF
    if (this.config.logLevel === LogLevel.OFF) {
      return
    }

    const logDataObject: RemoteLogData = {
      ...createJsonLogObjectData(level, context, dTimestamp, args),
      requestInfo: this.logRequestInfoProvider ? this.logRequestInfoProvider.getRequestInfo() : {},
    }

    this.logsSubject.next({
      message: JSON.stringify(logDataObject, this.jsonStringifyReplacer),
      timestamp: dTimestamp.getTime(),
      logStreamName: this.clientId,
    })
  }

  private setup() {
    // actual log subscription
    this.logsSubject
      .pipe(
        // wait for log stream to be created
        withLatestFrom(this.logStream$.pipe(first())),
        // put logs to cloudwatch
        mergeMap(([logEvent]) => this.putLogEvent(logEvent)),
      )
      .subscribe({ error: console.error.bind(console) })
  }

  private readonly createLogStream = (): Observable<void> => {
    const logStream = {
      logGroupName: this.config.logGroupName,
      logStreamName: this.clientId,
    }
    return this.httpClient
      .post(this.config.createLogStreamApiUrl, logStream, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'text', // prevent angular from parsing something
      })
      .pipe(
        map(() => void 0),
        catchError((err) => {
          console.error('log stream could not be created:', err)
          return throwError(() => new Error('log stream could not be created'))
        }),
      )
  }

  private readonly putLogEvent = (logEvent: CloudWatchLogEvent): Observable<boolean> => {
    // outer observable only for retry logic -- see below
    return of(logEvent).pipe(
      // call to cloudwatch
      mergeMap((logEvent) => of(this.sendPutLogEvent(logEvent))),
      // we catch and ignore all errors
      catchError((err) => {
        console.warn('unable to put logs to CloudWatch --> we try again with the next log event', err)
        return of(false)
      }),
    )
  }

  private readonly sendPutLogEvent = (logEvent: CloudWatchLogEvent): boolean => {
    return navigator.sendBeacon(this.config.logApiUrl, JSON.stringify(logEvent))
  }
}
