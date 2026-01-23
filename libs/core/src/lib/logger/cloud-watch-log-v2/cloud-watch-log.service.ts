/* eslint-disable */
import { inject, Injectable } from '@angular/core'
import { createJsonLogObjectData, getJsonStringifyReplacer, JsonLogObjectData, LogLevel, pushToRingBuffer } from '@shiftcode/logger'
import { jsonMapSetStringifyReplacer } from '@shiftcode/utilities'
import { buffer, catchError, defer, filter, first, mergeMap, Observable, of, Subject, timer } from 'rxjs'

import { CloudWatchLogV2ApiService, HttpApiError, LogEvent } from './cloud-watch-log-api.service'
import { CLOUD_WATCH_LOG_V2_CONFIG } from './cloud-watch-log-config.injection-token'
import { LOG_REQUEST_INFO_FN } from '../log-request-info-fn.token'
import { ClientIdService } from '../../client-id/client-id.service'

/**
 * Service to send messages to the integration api for CloudWatch Logs
 * requires the {@link CLOUD_WATCH_LOG_V2_CONFIG} to be provided
 */
@Injectable({ providedIn: 'root' })
export class CloudWatchLogV2Service {
  // max request per second per log stream
  private static readonly CLOUD_WATCH_RATE_LIMIT = 1000 / 5

  private readonly api = inject(CloudWatchLogV2ApiService)
  private readonly logsSubject = new Subject<LogEvent>()
  private readonly clientId: string

  private readonly logRequestInfoFn = inject(LOG_REQUEST_INFO_FN, { optional: true })
  private readonly config = inject(CLOUD_WATCH_LOG_V2_CONFIG)
  private readonly jsonStringifyReplacer = this.config.jsonStringifyReplacer || jsonMapSetStringifyReplacer
  private readonly bufferSize = this.config.bufferSize || 100

  /** Ring buffer for log events below the configured level, flushed on ERROR */
  private pendingBuffer: LogEvent[] = []

  constructor() {
    const clientIdService = inject(ClientIdService)

    this.clientId = clientIdService.clientId

    // no instantiation if LogLevel === OFF
    if (this.config.logLevel !== LogLevel.OFF) {
      // validation
      if (this.config.flushInterval <= CloudWatchLogV2Service.CLOUD_WATCH_RATE_LIMIT) {
        throw new Error(
          `Flush interval must be greater than ${CloudWatchLogV2Service.CLOUD_WATCH_RATE_LIMIT}ms --> CloudWatch Rate Limit`,
        )
      }

      const ready = this.getOrCreateLogStream(clientIdService)
      this.setupLogStream(ready)
    }
  }

  /**
   * add message to the queue to send to CloudWatch Service
   * only send when {@link CloudWatchLogTransportConfig#logLevel} is not {@link LogLevel#OFF }
   */
  addMessage(level: LogLevel, context: string, timestamp: Date, args: unknown[]) {
    if (this.config.logLevel === LogLevel.OFF) {
      return
    }
    const logEvent = this.buildLogEvent(level, context, timestamp, args)

    // if level is below threshold, buffer the event
    if (level < this.config.logLevel) {
      // we use `structuredClone` to prevent potential mutations of the logEvent before it is actually sent
      pushToRingBuffer(this.pendingBuffer, structuredClone(logEvent), this.bufferSize)
      return
    }

    // on ERROR: flush buffered events first, then clear buffer
    if (level === LogLevel.ERROR) {
      for (const bufferedEvent of this.pendingBuffer) {
        this.logsSubject.next(bufferedEvent)
      }
      this.pendingBuffer = []
    }

    this.logsSubject.next(logEvent)
  }

  private buildLogEvent(level: LogLevel, context: string, timestamp: Date, args: unknown[]): LogEvent {
    // Clone args to avoid mutating the original array
    let logData: JsonLogObjectData & { requestInfo?: unknown } = createJsonLogObjectData(level, context, timestamp, [
      ...args,
    ])

    if (this.logRequestInfoFn) {
      logData.requestInfo = this.logRequestInfoFn()
    }

    return {
      message: JSON.stringify(logData, getJsonStringifyReplacer(this.jsonStringifyReplacer)),
      // time it is sent. not the time of the log (that one is included in the message object)
      timestamp: new Date().getTime(),
    }
  }

  private getOrCreateLogStream({ createdInThisSession, clientId }: ClientIdService): Observable<void> {
    // return observable to keep it cold
    return defer(async () => {
      // if the clientId was created in this session, no LogStream can exist of it.
      if (createdInThisSession) {
        await this.api.createLogStream(clientId)
        return
      }
      try {
        await this.api.describeLogStream(clientId)
      } catch (error) {
        if (error instanceof HttpApiError && error.statusCode === 404) {
          await this.api.createLogStream(clientId)
          return
        }
        throw error
      }
    })
  }

  private setupLogStream(ready$: Observable<void>): void {
    // actual log subscription
    this.logsSubject
      .pipe(
        // buffer logs --> wait for ready$ to complete - then setup the time based interval scheduler
        buffer(
          ready$.pipe(
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

  private readonly putLogEvents = (events: LogEvent[]): Observable<void> => {
    // outer observable only for retry logic -- see below
    return defer(() => this.api.writeLogs(this.clientId, events)).pipe(
      catchError((err) => {
        console.warn('unable to put logs to CloudWatch --> we try again with the next batch', err)
        return of(void 0)
      }),
    )
  }
}
