/* eslint-disable no-console */
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Inject, Injectable, Optional } from '@angular/core'
import { createJsonLogObjectData, LogLevel } from '@shiftcode/logger'
import { REMOTE_LOG_CONFIG } from './remote-log-config.injection-token'
import { RemoteLogConfig } from './remote-log-config.model'
import { RemoteLogData } from './remote-log-data.model'
import { LOG_REQUEST_INFO } from '../log-request-info.token'

@Injectable({ providedIn: 'root' })
export class RemoteLogService {
  protected constructor(
    private httpClient: HttpClient,
    @Inject(REMOTE_LOG_CONFIG) private config: RemoteLogConfig,
    @Optional() @Inject(LOG_REQUEST_INFO) private logRequestInfoProvider?: Record<string, string>,
  ) {}

  sendMessage(level: LogLevel, context: string, timestamp: Date, args: any[]) {
    const remoteLogData: RemoteLogData = {
      ...createJsonLogObjectData(level, context, timestamp, args),
      requestInfo: this.logRequestInfoProvider ?? {},
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
