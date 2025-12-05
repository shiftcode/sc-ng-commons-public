import { Component, Directive, inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { Logger, LogLevel, LogTransport } from '@shiftcode/logger'
import { LoggerService } from '@shiftcode/ngx-core'

interface MockLogTransportConfig {
  logLevel: LogLevel
}

const MOCK_LOG_TRANSPORT_CONFIG = new InjectionToken<MockLogTransportConfig>('mockLogTransportConfig')

@Injectable()
class MockLogTransport1 extends LogTransport {
  constructor() {
    super(inject(MOCK_LOG_TRANSPORT_CONFIG).logLevel)
  }

  log(_level: LogLevel, _clazzName: string, _hexColor: string, _timestamp: Date, _args: any[]) {}
}

@Injectable()
class MockLogTransport2 extends LogTransport {
  constructor() {
    super(inject(MOCK_LOG_TRANSPORT_CONFIG).logLevel)
  }

  log(_level: LogLevel, _clazzName: string, _hexColor: string, _timestamp: Date, _args: any[]) {}
}

describe('when providing LogTransport', () => {
  it('throws when LogTransport was not provided with multi=true', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: LogTransport, useClass: MockLogTransport1 }],
    })
    expect(() => TestBed.inject(LoggerService)).toThrow(Error)
  })
})

describe('LoggerService with multiple providers', () => {
  let loggerService: LoggerService
  let logger: Logger

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: MOCK_LOG_TRANSPORT_CONFIG, useValue: <MockLogTransportConfig>{ logLevel: LogLevel.DEBUG } },
        { provide: LogTransport, useClass: MockLogTransport1, multi: true },
        { provide: LogTransport, useClass: MockLogTransport2, multi: true },
        LoggerService,
      ],
    })
    loggerService = TestBed.inject(LoggerService)
    logger = loggerService.getInstance('Test')
  })

  it('creates Logger instance with the provided name', () => {
    expect(logger).toBeInstanceOf(Logger)
    expect(logger['name']).toBe('Test')
  })

  it('uses multiple log transports', () => {
    expect(logger['loggerTransports'][0] instanceof MockLogTransport1).toBeTruthy()
    expect(logger['loggerTransports'][0].logLevel).toEqual(LogLevel.DEBUG)
    expect(logger['loggerTransports'][1] instanceof MockLogTransport2).toBeTruthy()
    expect(logger['loggerTransports'][1].logLevel).toEqual(LogLevel.DEBUG)
  })
})

@Directive({ selector: '[MyDirective]', standalone: true })
class MyDirective {
  private readonly logger: Logger = inject(LoggerService).getInstance('MyDirective')

  doSomething() {
    this.logger.debug('doing something')
  }
}

@Component({
  template: `<div MyDirective></div>`,
  standalone: true,
  imports: [MyDirective],
})
class TestComponent {}

describe('MyDirective', () => {
  let directiveInstance: MyDirective

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: MOCK_LOG_TRANSPORT_CONFIG, useValue: <MockLogTransportConfig>{ logLevel: LogLevel.DEBUG } },
        { provide: LogTransport, useClass: MockLogTransport1, multi: true },
        LoggerService,
      ],
    }).compileComponents()

    const fixture = TestBed.createComponent(TestComponent)
    directiveInstance = fixture.debugElement.query(By.directive(MyDirective)).injector.get(MyDirective)
  })

  it('creates Logger instance with the provided name', () => {
    expect(directiveInstance['logger']).toBeInstanceOf(Logger)
    expect(directiveInstance['logger']['name']).toBe('MyDirective')
  })

  it('should log a debug message when doSomething is called', () => {
    const loggerSpy = jest.spyOn(directiveInstance['logger'], 'debug')
    directiveInstance.doSomething()

    expect(loggerSpy).toHaveBeenCalledWith('doing something')
  })
})
