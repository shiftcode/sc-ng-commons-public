import { Inject, Injectable } from '@angular/core'
import { LogTransport } from './log-transport'
import { LOG_TRANSPORTS } from './log-transports.token'
import { LoggerHelper } from './logger-helper'
import { Logger } from './logger.model'

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private loggers = new Map<string, number>()

  constructor(@Inject(LOG_TRANSPORTS) private logTransports: LogTransport | LogTransport[]) {}

  getInstance(name: string, hexColor?: string): Logger {
    hexColor = hexColor || LoggerHelper.stringToColor(name)

    const loggerCount = this.loggers.get(name)
    if (loggerCount) {
      // add postfix with count
      const count = loggerCount + 1
      this.loggers.set(name, count)
      name += `_${count}`
    } else {
      this.loggers.set(name, 1)
    }

    return new Logger(name, hexColor, Array.isArray(this.logTransports) ? this.logTransports : [this.logTransports])
  }
}
