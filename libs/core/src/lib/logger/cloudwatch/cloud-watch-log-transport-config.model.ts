import { LogLevel } from '@shiftcode/logger'

export interface CloudWatchLogTransportConfig {
  logLevel: LogLevel
  logApiUrl: string
  createLogStreamApiUrl: string
  jsonStringifyReplacer?: (key: string, value: any) => any
}
