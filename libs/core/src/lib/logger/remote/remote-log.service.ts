/* eslint-disable no-console */
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { createJsonLogObjectData, LogLevel } from '@shiftcode/logger'
import { REMOTE_LOG_CONFIG } from './remote-log-config.injection-token'
import { RemoteLogConfig } from './remote-log-config.model'
import { RemoteLogData } from './remote-log-data.model'
import { LOG_REQUEST_INFO_FN } from '../log-request-info-fn.token'
import { LogRequestInfoFn } from '../log-request-info-fn.type'

@Injectable({ providedIn: 'root' })
export class RemoteLogService {
  private readonly httpClient = inject(HttpClient)
  private readonly config = inject<RemoteLogConfig>(REMOTE_LOG_CONFIG)
  private readonly logRequestInfoFn: LogRequestInfoFn = inject(LOG_REQUEST_INFO_FN, { optional: true }) ?? (() => ({}))

  sendMessage(level: LogLevel, context: string, timestamp: Date, args: any[]) {
    const remoteLogData: RemoteLogData = {
      ...createJsonLogObjectData(level, context, timestamp, args),
      requestInfo: this.logRequestInfoFn(),
    }
    this.postToBackend(remoteLogData)
  }

  private postToBackend(data: RemoteLogData): void {
    const headers = this.config.httpHeaders
      ? this.config.httpHeaders
      : new HttpHeaders().set('Content-Type', 'application/json')

    this.httpClient
      .post(this.config.url, data, {
        headers,
        responseType: 'text', // prevent angular from parsing something
      })
      .subscribe({
        error: (err) => console.warn('log could not be submitted', err),
      })
  }
}
