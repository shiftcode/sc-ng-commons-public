import { Injectable, inject } from '@angular/core'
import { Logger, BaseLoggerService, LogTransport } from '@shiftcode/logger'

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private baseService: BaseLoggerService

  constructor() {
    const logTransports = inject(LogTransport)
    if (!Array.isArray(logTransports)) {
      throw new Error('LOG_TRANSPORTS needs to be provided with multi:true')
    }
    this.baseService = new BaseLoggerService(logTransports)
  }

  getInstance(name: string, hexColor?: string): Logger {
    return this.baseService.getInstance(name, hexColor)
  }
}
