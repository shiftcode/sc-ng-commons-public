/* eslint-disable no-console */
import { isPlatformServer } from '@angular/common'
import { Injectable, PLATFORM_ID, inject } from '@angular/core'
import { leadingZero } from '../helper/leading-zero.function'
import { LogLevel, LogTransport } from '@shiftcode/logger'
import { CONSOLE_LOG_TRANSPORT_CONFIG } from './console-log-transport-config.injection-token'

@Injectable({ providedIn: 'root' })
export class ConsoleLogTransport extends LogTransport {
  constructor() {
    super(inject(CONSOLE_LOG_TRANSPORT_CONFIG).logLevel)
    if (isPlatformServer(inject(PLATFORM_ID))) {
      throw new Error('This log transport is only for client side use - consider using "NodeConsoleLogTransport"')
    }
  }

  log(level: LogLevel, clazzName: string, color: string, timestamp: Date, args: any[]) {
    if (this.isLevelEnabled(level)) {
      const now = [
        leadingZero(2, timestamp.getHours()),
        leadingZero(2, timestamp.getMinutes()),
        leadingZero(2, timestamp.getSeconds()),
        leadingZero(3, timestamp.getMilliseconds()),
      ].join(':') // 'HH:mm:ss:SSS'
      const firstArgument = args.splice(0, 1)[0]

      if (typeof firstArgument === 'string') {
        // we have a string with potential message format
        args.splice(0, 0, `%c${now} - ${clazzName} :: ${firstArgument}`, `color:${color}`)
      } else {
        args.splice(0, 0, `%c${now} - ${clazzName} ::`, `color:${color}`, firstArgument)
      }

      switch (level) {
        case LogLevel.DEBUG:
          console.debug(...args)
          break
        case LogLevel.ERROR:
          console.error(...args)
          break
        case LogLevel.INFO:
          console.info(...args)
          break
        case LogLevel.WARN:
          console.warn(...args)
          break
        default:
          console.log(...args)
          break
      }
    }
  }
}
