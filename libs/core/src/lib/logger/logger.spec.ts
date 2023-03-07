import { PLATFORM_ID } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { ConsoleLogTransportConfig } from './console/console-log-transport-config'
import { CONSOLE_LOG_TRANSPORT_CONFIG } from './console/console-log-transport-config.injection-token'
import { NodeConsoleLogTransport } from './console/node-console-log-transport.service'
import { LogLevel } from './log-level.enum'
import { LogTransport } from './log-transport'
import { LOG_TRANSPORTS } from './log-transports.token'
import { Logger } from './logger.model'
import { LoggerService } from './logger.service'
import { NoopLogTransport } from './noop/noop-log-transport.service'
import { provideNodeConsoleLogTransport } from './console/provide-node-console-log-transport.function'

// tslint:disable:no-console
// tslint:disable:max-classes-per-file

const warnLoggerConfig: ConsoleLogTransportConfig = {
  logLevel: LogLevel.WARN,
}

class Dummy1LogTransport extends LogTransport {
  log(level: LogLevel, clazzName: string, color: string, timestamp: Date, args: any[]): void {}
}

class Dummy2LogTransport extends LogTransport {
  log(level: LogLevel, clazzName: string, color: string, timestamp: Date, args: any[]): void {}
}

describe('Logger', () => {

  describe('when providing LOG_TRANSPORT', () => {
    test('throws when LOG_TRANSPORT was not provided with multi=true', () => {
      TestBed.configureTestingModule({
        providers: [{ provide: LOG_TRANSPORTS, useClass: NoopLogTransport }],
      })
      expect(() => TestBed.inject(LoggerService)).toThrow(Error)
    })

  })

  describe('LoggerService can handle Multiple providers', () => {
    let loggerService: LoggerService

    let logTransport1Spy: jest.SpyInstance
    let logTransport2Spy: jest.SpyInstance

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: CONSOLE_LOG_TRANSPORT_CONFIG, useValue: warnLoggerConfig },
          { provide: LOG_TRANSPORTS, useClass: Dummy1LogTransport, multi: true },
          { provide: LOG_TRANSPORTS, useClass: Dummy2LogTransport, multi: true },
          LoggerService,
        ],
      })
      loggerService = TestBed.inject(LoggerService)
      const transports: any = TestBed.inject(LOG_TRANSPORTS)
      logTransport1Spy = jest.spyOn(transports[0], 'log')
      logTransport2Spy = jest.spyOn(transports[1], 'log')
    })

    it('uses multiple log transports', () => {
      const instance = loggerService.getInstance('TEST')
      instance.warn('TEST_WARNING')
      expect(logTransport1Spy).toBeCalled()
      expect(logTransport2Spy).toBeCalled()
    })
  })

  describe('NodeConsoleLogTransport', () => {
    let loggerService: LoggerService
    let transportSpy: jest.SpyInstance
    let consoleWarnSpy: jest.SpyInstance
    let consoleDebugSpy: jest.SpyInstance

    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation()

      TestBed.configureTestingModule({
        providers: [
          { provide: PLATFORM_ID, useValue: 'server' },
          provideNodeConsoleLogTransport(warnLoggerConfig),
        ],
      })
      const transportImpl = TestBed.inject(LOG_TRANSPORTS)[0]
      loggerService = TestBed.inject(LoggerService)
      transportSpy = jest.spyOn(transportImpl, 'log')
    })

    it('creates Logger instance with the provided name', () => {
      const logger: Logger = loggerService.getInstance('Test')
      expect(logger).toBeInstanceOf(Logger)
    })

    it('calls log method on provided LogTransport implementation', () => {
      const logger: Logger = loggerService.getInstance('Test')
      logger.warn('TEST_WARNING')
      expect(transportSpy).toBeCalled()
      expect(transportSpy.mock.calls[0][0]).toEqual(LogLevel.WARN)
      expect(consoleWarnSpy).toBeCalled()
    })

    it('should nod log debug for config WARN', () => {
      const logger: Logger = loggerService.getInstance('Test')
      logger.debug('TEST_DEBUG')
      expect(transportSpy).toBeCalled()
      expect(transportSpy.mock.calls[0][0]).toEqual(LogLevel.DEBUG)
      expect(consoleDebugSpy).not.toBeCalled()
    })
  })
})
