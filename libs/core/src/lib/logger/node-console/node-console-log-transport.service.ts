import { isPlatformBrowser } from '@angular/common'
import { inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core'
import { getJsonStringifyReplacer, LogLevel, LogTransport } from '@shiftcode/logger'
import { colorizeForConsole, jsonMapSetStringifyReplacer } from '@shiftcode/utilities'

import { loggingTimeFormat } from '../helper/logging-time-format.const'
import { logLevelEmoji } from './log-level-emoji.const'

export interface NodeConsoleLogTransportConfig {
  logLevel: LogLevel

  /**
   *  custom replacer function for JSON serialization, default to @shiftcode/utilities jsonMapSetStringifyReplacer
   */
  jsonStringifyReplacer?: (key: string, value: unknown) => unknown

  /** max depth for object serialization, default is 5 */
  maxDepth?: number
}

export const NODE_CONSOLE_LOG_TRANSPORT_CONFIG = new InjectionToken<NodeConsoleLogTransportConfig>(
  'NODE_CONSOLE_LOG_TRANSPORT_CONFIG',
  { factory: () => ({ logLevel: LogLevel.DEBUG }) },
)

// we do not extend the NodeConsoleLogTransport from @shiftcode/logger since it uses `node:utils` which would break ts here without further changes
@Injectable({ providedIn: 'root' })
export class NodeConsoleLogTransportService extends LogTransport {
  private readonly config: NodeConsoleLogTransportConfig

  constructor() {
    const config = inject(NODE_CONSOLE_LOG_TRANSPORT_CONFIG)
    super(config.logLevel)
    this.config = config

    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      throw new Error('This log transport is only for server side use - consider using "ConsoleLogTransport"')
    }
  }

  log(level: LogLevel, clazzName: string, hexColor: string, timestamp: Date, args: any[]) {
    if (this.isLevelEnabled(level)) {
      const now = loggingTimeFormat.format(timestamp)
      // make sure to not alter the input args array
      if (typeof args[0] === 'string') {
        // if first arg is string, also colorize it
        args = [
          logLevelEmoji[level],
          colorizeForConsole(`${now} - ${clazzName} :: ${args[0]}`, hexColor),
          ...args.slice(1).map(this.stringifyJson),
        ]
      } else {
        args = [
          logLevelEmoji[level],
          colorizeForConsole(`${now} - ${clazzName} ::`, hexColor),
          ...args.map(this.stringifyJson),
        ]
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

  private readonly stringifyJson = (data: unknown) => {
    const maxDepth = this.config.maxDepth ?? 5
    const jsonStringifyReplacer = getJsonStringifyReplacer(
      this.config.jsonStringifyReplacer ?? jsonMapSetStringifyReplacer,
    )

    const seen = new WeakMap<object, number>()
    let refCounter = 0
    const handleDepthAndCircularRefs = (value: unknown, depth: number = 0): unknown => {
      if (depth > maxDepth) {
        return '[max depth reached]'
      }

      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return `[circular ref #${seen.get(value)}]`
        } else {
          seen.set(value, ++refCounter)
        }

        if (Array.isArray(value)) {
          return value.map((v) => handleDepthAndCircularRefs(v, depth + 1))
        }

        const result: any = {}
        for (const [k, v] of Object.entries(value)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          result[k] = handleDepthAndCircularRefs(v, depth + 1)
        }
        return result
      }

      return value
    }

    return JSON.stringify(handleDepthAndCircularRefs(data), jsonStringifyReplacer)
  }
}
