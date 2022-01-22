import { MockLogger } from './mock-logger.model'

export class MockLoggerService {
  readonly loggers = new Map<string, MockLogger[]>()

  constructor() {}

  getInstance(name: string, hexColor?: string): MockLogger {
    const logger = new MockLogger()

    const existingArray = this.loggers.get(name) || []
    this.loggers.set(name, [...existingArray, logger])
    return logger
  }
}
