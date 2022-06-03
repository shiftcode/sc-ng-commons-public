import { isPlatformBrowser } from '@angular/common'
import { colorizeForConsole } from '@shiftcode/utilities'
import { Inject, Injectable, PLATFORM_ID } from '@angular/core'
import { leadingZero } from '../helper/leading-zero.function'
import { LogLevel } from '../log-level.enum'
import { LogTransport } from '../log-transport'
import { ConsoleLogTransportConfig } from './console-log-transport-config'
import { CONSOLE_LOG_TRANSPORT_CONFIG } from './console-log-transport-config.injection-token'

@Injectable({ providedIn: 'root' })
export class NodeConsoleLogTransport extends LogTransport {
  constructor(
    @Inject(CONSOLE_LOG_TRANSPORT_CONFIG) consoleLoggerConfig: ConsoleLogTransportConfig,
    @Inject(PLATFORM_ID) platformId: any,
  ) {
    super()
    if (isPlatformBrowser(platformId)) {
      throw new Error('This log transport is only for server side use - consider using "ConsoleLogTransport"')
    }
    this.logLevel = consoleLoggerConfig.logLevel
  }

  log(level: LogLevel, clazzName: string, hexColor: string, timestamp: Date, args: any[]) {
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
        args.splice(0, 0, colorizeForConsole(`${now} - ${clazzName} :: ${firstArgument}`, hexColor))
      } else {
        args.splice(0, 0, colorizeForConsole(`${now} - ${clazzName} ::`, hexColor), firstArgument)
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
