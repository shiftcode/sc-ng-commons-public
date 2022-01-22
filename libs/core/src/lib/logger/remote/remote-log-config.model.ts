import { HttpHeaders } from '@angular/common/http'
import { LogLevel } from '../log-level.enum'

export interface RemoteLogConfig {
  logLevel: LogLevel
  httpHeaders?: HttpHeaders
  url: string
}
