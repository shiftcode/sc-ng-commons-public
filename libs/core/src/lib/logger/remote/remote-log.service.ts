/* eslint-disable no-console */
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Inject, Injectable, Optional } from '@angular/core'
import { getEnumKeyFromNum } from '@shiftcode/utilities'
import { LogLevel } from '@shiftcode/logger'
import { LogRequestInfoProvider } from '../log-request-info-provider'
import { LoggerHelper } from '../logger-helper'
import { REMOTE_LOG_CONFIG } from './remote-log-config.injection-token'
import { RemoteLogConfig } from './remote-log-config.model'
import { RemoteLogData } from './remote-log-data.model'

@Injectable({ providedIn: 'root' })
export class RemoteLogService {
  protected constructor(
    private httpClient: HttpClient,
    @Inject(REMOTE_LOG_CONFIG) private config: RemoteLogConfig,
    @Optional() private logRequestInfoProvider?: LogRequestInfoProvider,
  ) {}

  sendMessage(level: LogLevel, context: string, timestamp: Date, args: any[]) {
    const remoteLogData: RemoteLogData = {
      level: getEnumKeyFromNum(LogLevel, level),
      timestamp: timestamp.toISOString(),
      logger: context,
      requestInfo: this.logRequestInfoProvider ? this.logRequestInfoProvider.getRequestInfo() : {},
    }

    const msgOrError = args.shift()

    if (typeof msgOrError === 'string') {
      remoteLogData.message = LoggerHelper.formatArguments(msgOrError, args)
      remoteLogData.data = this.tryStringify(args)
      this.postToBackend(remoteLogData)
    } else if (msgOrError instanceof Error) {
      remoteLogData.message = msgOrError.message
      remoteLogData.errorName = msgOrError.name
      remoteLogData.exception = msgOrError.stack?.toString()
      remoteLogData.data = this.tryStringify(args)
      this.postToBackend(remoteLogData)
    } else {
      console.warn('make sure to supply string or error as first argument in log statements')
    }
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

  private tryStringify(data: any[]): string | undefined {
    if (data.length === 0) {
      return
    }
    try {
      return JSON.stringify(data)
    } catch {
      console.warn('could not stringify provided log object', data)
      return
    }
  }
}
