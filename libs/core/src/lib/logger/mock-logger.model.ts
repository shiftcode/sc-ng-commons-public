import { LogLevel } from '@shiftcode/logger'

export class MockLogger {
  readonly statements: Record<LogLevel, any[][]> = {
    [LogLevel.INFO]: [],
    [LogLevel.WARN]: [],
    [LogLevel.ERROR]: [],
    [LogLevel.DEBUG]: [],
    [LogLevel.OFF]: [],
  }

  info(...args: any[]) {
    this.statements[LogLevel.INFO].push(args)
  }

  warn(...args: any[]) {
    this.statements[LogLevel.WARN].push(args)
  }

  error(...args: any[]) {
    this.statements[LogLevel.ERROR].push(args)
  }

  debug(...args: any[]) {
    this.statements[LogLevel.DEBUG].push(args)
  }
}
