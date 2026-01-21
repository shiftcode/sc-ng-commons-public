import { isPlatformServer } from '@angular/common'
import { inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core'
import { LogLevel, LogTransport } from '@shiftcode/logger'

import { loggingTimeFormat } from '../helper/logging-time-format.const'

export interface BrowserConsoleLogTransportConfig {
  logLevel: LogLevel
}

export const BROWSER_CONSOLE_LOG_TRANSPORT_CONFIG = new InjectionToken<BrowserConsoleLogTransportConfig>(
  'BROWSER_CONSOLE_LOG_TRANSPORT_CONFIG',
  { factory: () => ({ logLevel: LogLevel.DEBUG }) },
)

@Injectable({ providedIn: 'root' })
export class BrowserConsoleLogTransportService extends LogTransport {
  constructor() {
    super(inject(BROWSER_CONSOLE_LOG_TRANSPORT_CONFIG).logLevel)
    if (isPlatformServer(inject(PLATFORM_ID))) {
      throw new Error('This log transport is only for client side use - consider using "NodeConsoleLogTransport"')
    }
  }

  log(level: LogLevel, clazzName: string, color: string, timestamp: Date, args: any[]) {
    if (this.isLevelEnabled(level)) {
      const now = loggingTimeFormat.format(timestamp)

      const firstArgument = args.splice(0, 1)[0]

      if (typeof firstArgument === 'string') {
        // we have a string with potential message format
        args.splice(0, 0, `%c${now} - ${clazzName} :: ${firstArgument}`, `color:${color}`)
      } else {
        args.splice(0, 0, `%c${now} - ${clazzName} ::`, `color:${color}`, firstArgument)
      }

      /* eslint-disable no-console */
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
        case LogLevel.OFF:
          break
        default:
          return level // exhaustive check
      }
      /* eslint-enable no-console */
    }
  }
}
