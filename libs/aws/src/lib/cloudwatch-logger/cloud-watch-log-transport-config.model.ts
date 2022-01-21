import { Credentials } from '@aws-sdk/types'
import { LogLevel } from '@shiftcode/ngx-core'
import { Observable } from 'rxjs'

export interface CloudWatchLogTransportConfig {
  logLevel: LogLevel
  logGroupName: string
  awsRegion: string
  awsCredentials$: Observable<Credentials | undefined>
  /** milliseconds until logs are flushed to aws */
  flushInterval: number
  jsonStringifyReplacer?: (key: string, value: any) => any
}
