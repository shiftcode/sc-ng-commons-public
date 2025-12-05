/* eslint-disable no-console */
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { createJsonLogObjectData, LogLevel } from '@shiftcode/logger'
import { jsonMapSetStringifyReplacer } from '@shiftcode/utilities'
import {
  BehaviorSubject,
  catchError,
  concatMap,
  filter,
  map,
  mergeMap,
  Observable,
  of,
  retry,
  shareReplay,
  Subject,
  take,
  throwError,
} from 'rxjs'

import { ClientIdService } from '../../client-id/client-id.service'
import { LOG_REQUEST_INFO_FN } from '../log-request-info-fn.token'
import { RemoteLogData } from '../remote/remote-log-data.model'
import { CLOUD_WATCH_LOG_TRANSPORT_CONFIG } from './cloud-watch-log-transport-config.injection-token'
import { isLogStreamNotFoundError } from './is-error.function'

interface CloudWatchLogEvent {
  logStreamName: string
  timestamp: number
  message: string
}

/**
 * Service to send messages to CloudWatch via APIGateway
 * requires the {@link CLOUD_WATCH_LOG_TRANSPORT_CONFIG} to be provided
 */
@Injectable({ providedIn: 'root' })
export class CloudWatchService {
  private readonly httpClient = inject(HttpClient)
  private readonly config = inject(CLOUD_WATCH_LOG_TRANSPORT_CONFIG)
  private readonly logRequestInfoFn = inject(LOG_REQUEST_INFO_FN, { optional: true })

  private readonly retrying$ = new BehaviorSubject<boolean>(false)
  private readonly logStream$ = new Observable<void>()
  private readonly logsSubject = new Subject<CloudWatchLogEvent>()
  private readonly clientId: string
  private readonly jsonStringifyReplacer: (key: string, value: any) => any

  constructor() {
    const clientIdService = inject(ClientIdService)

    this.clientId = clientIdService.clientId
    this.jsonStringifyReplacer = this.config.jsonStringifyReplacer || jsonMapSetStringifyReplacer
    // no instantiation if LogLevel === OFF
    if (this.config.logLevel === LogLevel.OFF) {
      return
    }
    this.logStream$ = of(void 0).pipe(
      mergeMap(() => (clientIdService.createdInThisSession ? this.createLogStream() : of(void 0))),
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
    }
    if (this.logRequestInfoFn) {
      logDataObject.requestInfo = this.logRequestInfoFn()
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
        // Ensure the log stream is created before processing log events
        concatMap((logEvent) =>
          this.logStream$.pipe(
            map(() => logEvent), // Pass the logEvent after the logStream is ready
          ),
        ),
        // put logs to cloudwatch
        mergeMap((logEvent) => this.putLogEvent(logEvent)),
      )
      .subscribe({ error: console.error.bind(console) })
  }

  private readonly createLogStream = (): Observable<void> => {
    const logStream = {
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

  private readonly putLogEvent = (logEvent: CloudWatchLogEvent): Observable<void> => {
    // outer observable only for retry logic -- see below
    return of(logEvent).pipe(
      // call to cloudwatch
      mergeMap((logEvent) => this.waitForRetryCompletion().pipe(mergeMap(() => this.sendPutLogEvent(logEvent)))),
      retry({ delay: (error) => this.handleRetry(error) }),
      map(() => void 0),
      // we catch and ignore all errors
      catchError((err) => {
        console.warn('unable to put logs to CloudWatch --> we try again with the next log event', err)
        return of(void 0)
      }),
    )
  }

  private readonly sendPutLogEvent = (logEvent: CloudWatchLogEvent): Observable<string> => {
    return this.httpClient.post(this.config.logApiUrl, logEvent, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'text', // prevent angular from parsing something
    })
  }

  private waitForRetryCompletion(): Observable<void> {
    return this.retrying$.pipe(
      filter((retrying) => !retrying),
      take(1),
      map(() => void 0),
    )
  }

  private handleRetry(error: any): Observable<void> {
    if (isLogStreamNotFoundError(error)) {
      if (!this.retrying$.value) {
        this.retrying$.next(true)
        return this.createLogStream().pipe(
          map(() => {
            this.retrying$.next(false)
            return void 0
          }),
          catchError((retryErr) => {
            this.retrying$.next(false)
            return throwError(() => retryErr)
          }),
        )
      } else {
        return of(void 0)
      }
    }
    return throwError(() => error)
  }
}
