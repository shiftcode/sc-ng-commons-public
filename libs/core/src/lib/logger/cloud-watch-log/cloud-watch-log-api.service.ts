// eslint-disable-next-line max-classes-per-file
import { inject, Injectable } from '@angular/core'
import { CommonHttpHeader, ContentType } from '@shiftcode/utilities'

import { CLOUD_WATCH_LOG_V2_CONFIG } from './cloud-watch-log-config.injection-token'

export interface LogStream {
  logStreamName: string
  creationTime: number
  lastIngestionTime: number | null
}

export interface LogEvent {
  message: string
  timestamp: number
}

export interface WriteLogEvents {
  logEvents: LogEvent[]
}

export class HttpError extends Error {
  override readonly name: string = 'HttpError'

  constructor(
    readonly statusCode: number,
    message: string,
  ) {
    super(`${statusCode} - ${message}`)
  }
}

export class HttpApiError extends HttpError {
  override readonly name: string = 'HttpApiError'

  constructor(
    statusCode: number,
    readonly errorCode: string,
    message: string,
  ) {
    super(statusCode, `${message} (${errorCode})`)
  }
}

enum ApiPath {
  STREAMS = 'streams',
  STREAM_LOGS = 'logs',
}

@Injectable({ providedIn: 'root' })
export class CloudWatchLogV2ApiService {
  private readonly apiUrl = inject(CLOUD_WATCH_LOG_V2_CONFIG).apiUrl

  async createLogStream(logStreamName: string): Promise<void> {
    const resp = await fetch(new URL(ApiPath.STREAMS, this.apiUrl), {
      method: 'POST',
      headers: { [CommonHttpHeader.CONTENT_TYPE]: ContentType.JSON },
      body: JSON.stringify({ logStreamName }),
    })
    await this.handleError(resp)
  }

  async describeLogStream(logStreamName: string): Promise<LogStream> {
    const result = await fetch(new URL(`${ApiPath.STREAMS}/${logStreamName}`, this.apiUrl), {
      method: 'GET',
      headers: { [CommonHttpHeader.CONTENT_TYPE]: ContentType.JSON },
    })
    await this.handleError(result)
    return (await result.json()) as LogStream
  }

  writeLogs(logStreamName: string, logs: LogEvent[]): Promise<void> {
    const url = new URL(`${ApiPath.STREAMS}/${logStreamName}/${ApiPath.STREAM_LOGS}`, this.apiUrl)

    // since the sendBeacon does not support providing headers directly,
    //   we use a blob, to achieve the same effect (content-type application/json)
    const data = new Blob([JSON.stringify({ logEvents: logs } satisfies WriteLogEvents)], { type: 'application/json' })

    // we use the beacon api to ensure log sending requests are not cancelled on page unload
    const ok = navigator.sendBeacon(url, data)

    return ok ? Promise.resolve() : Promise.reject(new Error('Failed to send logs via sendBeacon'))
  }

  private async handleError(resp: Response): Promise<void> {
    if (!resp.ok) {
      const errorResponse: object = (await resp.json().catch(() => ({}))) ?? {}
      if (
        'message' in errorResponse &&
        typeof errorResponse.message === 'string' &&
        'code' in errorResponse &&
        typeof errorResponse.code === 'string'
      ) {
        throw new HttpApiError(resp.status, errorResponse.code, errorResponse.message)
      } else {
        throw new HttpError(resp.status, 'unknown error')
      }
    }
  }
}
