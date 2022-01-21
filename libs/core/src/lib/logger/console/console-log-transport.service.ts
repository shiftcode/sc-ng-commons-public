import { isPlatformServer } from '@angular/common'
import { Inject, Injectable, PLATFORM_ID } from '@angular/core'
import { leadingZero } from '../helper/leading-zero.function'
import { LogLevel } from '../log-level.enum'
import { LogTransport } from '../log-transport'
import { ConsoleLogTransportConfig } from './console-log-transport-config'
import { CONSOLE_LOG_TRANSPORT_CONFIG } from './console-log-transport-config.injection-token'

@Injectable({ providedIn: 'root' })
export class ConsoleLogTransport extends LogTransport {
  constructor(
    @Inject(CONSOLE_LOG_TRANSPORT_CONFIG) consoleLoggerConfig: ConsoleLogTransportConfig,
    @Inject(PLATFORM_ID) platformId: any,
  ) {
    super()
    if (isPlatformServer(platformId)) {
      throw new Error('This log transport is only for client side use - consider using "NodeConsoleLogTransport"')
    }
    this.logLevel = consoleLoggerConfig.logLevel
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

      // tslint:disable:no-console
      switch (level) {
        case LogLevel.DEBUG:
          console.debug.apply<Console, any[], void>(console, args)
          break
        case LogLevel.ERROR:
          console.error.apply<Console, any[], void>(console, args)
          break
        case LogLevel.INFO:
          console.info.apply<Console, any[], void>(console, args)
          break
        case LogLevel.WARN:
          console.warn.apply<Console, any[], void>(console, args)
          break
        default:
          console.log.apply<Console, any[], void>(console, args)
          break
      }
      // tslint:enable:no-console
    }
  }
}
