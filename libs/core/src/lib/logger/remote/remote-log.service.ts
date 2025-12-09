/* eslint-disable no-console */
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { createJsonLogObjectData, LogLevel } from '@shiftcode/logger'

import { LOG_REQUEST_INFO_FN } from '../log-request-info-fn.token'
import { REMOTE_LOG_CONFIG } from './remote-log-config.injection-token'
import { RemoteLogData } from './remote-log-data.model'

@Injectable({ providedIn: 'root' })
export class RemoteLogService {
  private readonly httpClient = inject(HttpClient)
  private readonly config = inject(REMOTE_LOG_CONFIG)
  private readonly logRequestInfoFn = inject(LOG_REQUEST_INFO_FN, { optional: true })

  sendMessage(level: LogLevel, context: string, timestamp: Date, args: any[]) {
    const remoteLogData: RemoteLogData = {
      ...createJsonLogObjectData(level, context, timestamp, args),
    }
    if (this.logRequestInfoFn) {
      remoteLogData.requestInfo = this.logRequestInfoFn()
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
