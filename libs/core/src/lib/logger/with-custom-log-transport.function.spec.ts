import { Injectable } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { LogLevel, LogTransport } from '@shiftcode/logger'
import { LoggerService } from '@shiftcode/ngx-core'
import { describe, expect, test, vi } from 'vitest'

import { provideLogger } from './provide-logger'
import { withCustomLogTransport } from './with-custom-log-transport.function'

@Injectable()
class CustomLogTransport extends LogTransport {
  log = vi.fn()

  constructor() {
    super(LogLevel.DEBUG)
  }
}

function setup() {
  TestBed.configureTestingModule({
    providers: [provideLogger(withCustomLogTransport(CustomLogTransport))],
  })

  const loggerService = TestBed.inject(LoggerService)
  const logger = loggerService.getInstance('TestLogger')

  return {
    logger,
    get customTransport() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return logger['loggerTransports'][0] as CustomLogTransport
    },
  }
}

describe('withCustomLogTransport', () => {
  test('registers the custom LogTransport', () => {
    const { customTransport } = setup()
    expect(customTransport).toBeInstanceOf(CustomLogTransport)
  })

  test('logger uses the custom transport for logging', () => {
    const { logger, customTransport } = setup()

    logger.info('test message')

    expect(customTransport.log).toHaveBeenCalledWith(
      LogLevel.INFO,
      'TestLogger',
      expect.any(String),
      expect.any(Date),
      ['test message'],
    )
  })
})
