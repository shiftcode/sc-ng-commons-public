import { ErrorHandler, Injectable } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { LogLevel, LogTransport } from '@shiftcode/logger'
import { describe, expect, test, vi } from 'vitest'

import { LoggerErrorHandler } from './logger-error-handler'
import { provideLogger } from './provide-logger'
import { withErrorHandlerFn } from './with-error-handler.function'

@Injectable()
class SpyLogTransport extends LogTransport {
  log = vi.fn()

  constructor() {
    super(LogLevel.DEBUG)
  }
}

function setup() {
  const spyTransport = new SpyLogTransport()

  TestBed.configureTestingModule({
    providers: [{ provide: LogTransport, useValue: spyTransport, multi: true }, provideLogger(withErrorHandlerFn())],
  })

  return {
    spyTransport,
    errorHandler: TestBed.inject(ErrorHandler),
  }
}

describe('LoggerErrorHandler integration', () => {
  test('withErrorHandlerFn registers LoggerErrorHandler as ErrorHandler', () => {
    const { errorHandler } = setup()
    expect(errorHandler).toBeInstanceOf(LoggerErrorHandler)
  })

  test('handleError logs the error via LogTransport', () => {
    const { errorHandler, spyTransport } = setup()
    const testError = new Error('test error')

    errorHandler.handleError(testError)

    expect(spyTransport.log).toHaveBeenCalledWith(
      LogLevel.ERROR,
      'ErrorHandler',
      expect.any(String),
      expect.any(Date),
      [testError],
    )
  })

  test('handleError works with non-Error values', () => {
    const { errorHandler, spyTransport } = setup()

    errorHandler.handleError('string error')

    expect(spyTransport.log).toHaveBeenCalledWith(
      LogLevel.ERROR,
      'ErrorHandler',
      expect.any(String),
      expect.any(Date),
      ['string error'],
    )
  })
})
