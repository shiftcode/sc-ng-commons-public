import { InjectionToken } from '@angular/core'
import { LogLevel } from '@shiftcode/logger'

export interface CloudWatchLogTransportConfigV2 {
  logLevel: LogLevel
  apiUrl: string

  /** milliseconds until logs are flushed to aws */
  flushInterval: number
  jsonStringifyReplacer?: (key: string, value: any) => any

  /** max number of sub-threshold log events to buffer before dropping oldest. default 100 */
  bufferSize?: number
}

export const CLOUD_WATCH_LOG_TRANSPORT_CONFIG_V2 = new InjectionToken<CloudWatchLogTransportConfigV2>(
  'CLOUD_WATCH_LOG_TRANSPORT_CONFIG_V2',
)
