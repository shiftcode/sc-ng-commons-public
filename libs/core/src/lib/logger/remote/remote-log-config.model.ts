import { HttpHeaders } from '@angular/common/http'
import { LogLevel } from '@shiftcode/logger'

export interface RemoteLogConfig {
  logLevel: LogLevel
  httpHeaders?: HttpHeaders
  url: string
}
