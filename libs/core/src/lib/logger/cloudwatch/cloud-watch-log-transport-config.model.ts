import { LogLevel } from '@shiftcode/logger'

export interface CloudWatchLogTransportConfig {
  logLevel: LogLevel
  logGroupName: string
  logApiUrl: string
  createLogStreamApiUrl: string
  jsonStringifyReplacer?: (key: string, value: any) => any
}
