import { LogLevel } from './log-level.enum'

export abstract class LogTransport {
  protected logLevel: LogLevel

  abstract log(level: LogLevel, clazzName: string, color: string, timestamp: Date, args: any[]): void

  protected isLevelEnabled(level: LogLevel) {
    return level >= this.logLevel
  }
}
