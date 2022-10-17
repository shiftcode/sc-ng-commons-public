import { CloudWatchLogsClientConfig } from '@aws-sdk/client-cloudwatch-logs'
import { LogLevel } from '@shiftcode/ngx-core'
import { Observable } from 'rxjs'

export interface CloudWatchLogTransportConfig {
  logLevel: LogLevel
  logGroupName: string
  clientConfig$: Observable<CloudWatchLogsClientConfig>
  /** milliseconds until logs are flushed to aws */
  flushInterval: number
  jsonStringifyReplacer?: (key: string, value: any) => any
}
