import { Inject, Injectable } from '@angular/core'
import { Logger, LoggerService as BaseLoggerService, LogTransport } from '@shiftcode/logger'

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private baseService: BaseLoggerService

  constructor(@Inject(LogTransport) private logTransports: LogTransport[]) {
    if (!Array.isArray(this.logTransports)) {
      throw new Error('LOG_TRANSPORTS needs to be provided with multi:true')
    }
    this.baseService = new BaseLoggerService(logTransports)
  }

  getInstance(name: string, hexColor?: string): Logger {
    return this.baseService.getInstance(name, hexColor)
  }
}
