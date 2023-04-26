import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { PLATFORM_ID } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { LOG_TRANSPORTS, LogLevel, NoopLogTransport, ORIGIN } from '@shiftcode/ngx-core'
import { SsrHttpInterceptor } from './ssr-http.interceptor'
// tslint:disable:no-non-null-assertion

describe(`SsrHttpInterceptor`, () => {
  describe('constructor', () => {
    test('throws when not serverside', () => {
      TestBed.configureTestingModule({
        providers: [
          { provide: ORIGIN, useValue: 'http://localhost' },
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
      })
      expect(() => TestBed.inject(SsrHttpInterceptor)).toThrow(Error)
    })
  })

  describe('intercept', () => {
    const targetOrigin = 'https://target.io'
    let httpClient: HttpClient
    let httpController: HttpTestingController
    let interceptorSpy: jest.SpyInstance<any, Parameters<SsrHttpInterceptor['intercept']>>
    let logTransportSpy: jest.SpyInstance<void, Parameters<NoopLogTransport['log']>>

    function initBeforeEach(this: undefined, origin = targetOrigin) {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          { provide: LOG_TRANSPORTS, useClass: NoopLogTransport, multi: true },
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: ORIGIN, useValue: origin },
          { provide: HTTP_INTERCEPTORS, useClass: SsrHttpInterceptor, multi: true },
        ],
      })
      httpClient = TestBed.inject(HttpClient)
      httpController = TestBed.inject(HttpTestingController)

      const logTransport = TestBed.inject(LOG_TRANSPORTS).find((i) => i instanceof NoopLogTransport)!
      logTransportSpy = <any>jest.spyOn(logTransport, 'log')
      const interceptor = TestBed.inject(HTTP_INTERCEPTORS).find((i) => i instanceof SsrHttpInterceptor)!
      interceptorSpy = <any>jest.spyOn(interceptor, 'intercept')
    }

    function cleanupAfterEach() {
      httpController.verify()
    }

    describe('rewrites relative urls', () => {
      beforeEach(initBeforeEach)
      afterEach(cleanupAfterEach)

      test('relative with leading slash', () => {
        const relative = '/api/users'
        httpClient.get(relative).subscribe()
        expect(interceptorSpy).toHaveBeenCalledTimes(1)
        const req = httpController.expectOne(`${targetOrigin}${relative}`)
        req.flush({})
      })

      test('relative without leading slash', () => {
        const relative = 'api/users'
        httpClient.get(relative).subscribe()
        expect(interceptorSpy).toHaveBeenCalledTimes(1)
        const req = httpController.expectOne(`${targetOrigin}/${relative}`)
        req.flush({})
      })
    })

    describe('when trailing slash in origin', () => {
      beforeEach(initBeforeEach.bind(void 0, 'https://example.com/'))
      afterEach(cleanupAfterEach)

      test('does not send req with double slash', () => {
        const relative = '/api/users'
        httpClient.get(relative).subscribe()
        expect(interceptorSpy).toHaveBeenCalledTimes(1)
        const req = httpController.expectOne(`https://example.com${relative}`)
        req.flush({})
      })
    })

    describe('doesnt alter absolute urls', () => {
      beforeEach(initBeforeEach)
      afterEach(cleanupAfterEach)

      test('httpUrl', async () => {
        const httpURL = 'http://test.com/api/users'
        httpClient.get(httpURL).subscribe()
        expect(interceptorSpy).toHaveBeenCalledTimes(1)
        const req = httpController.expectOne(httpURL)
        req.flush({})
      })

      test('secureURL', async () => {
        const secureURL = 'https://test.com/api/users'
        httpClient.get(secureURL).subscribe()
        expect(interceptorSpy).toHaveBeenCalledTimes(1)
        const req = httpController.expectOne(secureURL)
        req.flush({})
      })

      test('protocolRelativeURL', () => {
        const protocolRelativeURL = '//test.com/api/users'
        httpClient.get(protocolRelativeURL).subscribe()
        expect(interceptorSpy).toHaveBeenCalledTimes(1)
        const req = httpController.expectOne(protocolRelativeURL)
        req.flush({})
      })

      test('warns when using protocolRelativeURL', () => {
        logTransportSpy.mockReset() // reset calls to the logger

        const protocolRelativeURL = '//test.com/api/users'

        httpClient.get(protocolRelativeURL).subscribe()
        const req = httpController.expectOne(protocolRelativeURL)
        req.flush({})

        expect(logTransportSpy).toHaveBeenCalledTimes(1)
        const logCallArgs = logTransportSpy.mock.calls[0]
        expect(logCallArgs[0]).toEqual(LogLevel.WARN)
        expect(logCallArgs[1]).toEqual('SsrHttpInterceptor')
        expect(logCallArgs[4][0]).toContain(protocolRelativeURL)
      })
    })
  })
})
