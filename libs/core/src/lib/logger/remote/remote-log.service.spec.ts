import { HttpHeaders, provideHttpClient } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { FactoryProvider, ValueProvider } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { createJsonLogObjectData, LogLevel } from '@shiftcode/logger'

import { LOG_REQUEST_INFO_FN } from '../log-request-info-fn.token'
import { LogRequestInfoFn } from '../log-request-info-fn.type'
import { RemoteLogService } from './remote-log.service'
import { REMOTE_LOG_CONFIG } from './remote-log-config.injection-token'
import { RemoteLogConfig } from './remote-log-config.model'

describe('RemoteLogService', () => {
  const mockConfig: RemoteLogConfig = {
    logLevel: LogLevel.DEBUG,
    url: 'https://logs.shiftcode.io/tests',
  }

  function setup(mockConfig: RemoteLogConfig, logRequestInfoFnFactory?: () => LogRequestInfoFn) {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: REMOTE_LOG_CONFIG, useValue: mockConfig } satisfies ValueProvider,
        ...(logRequestInfoFnFactory
          ? [{ provide: LOG_REQUEST_INFO_FN, useFactory: logRequestInfoFnFactory } satisfies FactoryProvider]
          : []),
      ],
    })
    return [TestBed.inject(RemoteLogService), TestBed.inject(HttpTestingController)] as const
  }

  it('should be created', () => {
    const [service] = setup(mockConfig)
    expect(service).toBeTruthy()
  })

  it('should send log data to backend with correct payload and headers', () => {
    const [service, httpMock] = setup(mockConfig)

    const context = 'TestContext'
    const timestamp = new Date('2025-09-08T20:25:00Z')
    const args = ['some message', { foo: 'bar' }]

    service.sendMessage(LogLevel.INFO, context, timestamp, args)

    const req = httpMock.expectOne(mockConfig.url, 'Log POST request')
    expect(req.request.method).toBe('POST')
    expect(req.request.headers.get('Content-Type')).toBe('application/json')
    expect(req.request.body).toEqual(
      expect.objectContaining(createJsonLogObjectData(LogLevel.INFO, context, timestamp, args)),
    )
    req.flush('ok')

    // assert that no other requests were made
    httpMock.verify()
  })

  it('uses httpHeaders from the custom config', () => {
    const headers = {
      xCustomHeader: 'customValue',
    } as const

    const customConfig: RemoteLogConfig = {
      logLevel: LogLevel.ERROR,
      url: 'https://logs.shiftcode.io/tests',
      httpHeaders: new HttpHeaders(headers),
    }
    const [service, httpMock] = setup(customConfig)

    const context = 'TestContext'
    const timestamp = new Date('2025-09-08T20:25:00Z')
    const args = ['error occurred', { error: 'details' }]

    service.sendMessage(LogLevel.ERROR, context, timestamp, args)

    const req = httpMock.expectOne(customConfig.url, 'Log POST request with custom headers')
    expect(req.request.method).toBe('POST')
    expect(req.request.headers.get('xCustomHeader' satisfies keyof typeof headers)).toBe(headers.xCustomHeader)
  })

  it('calls logRequestInfoFn and includes its result in the log data', () => {
    const logRequestInfoFn = jest.fn().mockReturnValue({ userId: '12345' })

    const [service, httpMock] = setup(mockConfig, () => logRequestInfoFn)

    const args = ['info message', { detail: 'info' }]
    service.sendMessage(LogLevel.INFO, 'TestContext', new Date(), args)

    const req = httpMock.expectOne(mockConfig.url, 'Log POST request with request info')
    expect(req.request.method).toBe('POST')
    expect(req.request.body).toEqual(expect.objectContaining({ requestInfo: { userId: '12345' } }))
    expect(logRequestInfoFn).toHaveBeenCalledTimes(1)
    req.flush('ok')
    httpMock.verify()
  })
})
