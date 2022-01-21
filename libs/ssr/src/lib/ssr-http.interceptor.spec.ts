import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { PLATFORM_ID } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { ORIGIN } from '@shiftcode/ngx-core'
import { SsrHttpInterceptor } from './ssr-http.interceptor'

const targetOrigin = 'https://target.io'

describe(`SsrHttpInterceptor`, () => {
  let httpClient: HttpClient
  let httpController: HttpTestingController

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

  xdescribe('intercept', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          { provide: HTTP_INTERCEPTORS, useClass: SsrHttpInterceptor, multi: true },
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: ORIGIN, useValue: targetOrigin },
        ],
      })
      httpClient = TestBed.inject(HttpClient)
      httpController = TestBed.inject(HttpTestingController)

      describe('rewrites relative urls', () => {
        test('relative 1', () => {
          const relative1 = 'api/users'
          httpClient.get(relative1).subscribe()
          httpController.expectOne(`${targetOrigin}/${relative1}`)
        })
        test('relative 2', () => {
          const relative2 = '/api/accounts'
          httpClient.get(relative2).subscribe()
          httpController.expectOne(`${targetOrigin}${relative2}`)
        })
      })

      describe('doesnt alter absolute urls', () => {

        test('httpUrl', () => {
          const httpURL = 'http://test.com/api/users'
          httpClient.get(httpURL).subscribe()
          httpController.expectOne(httpURL)
        })

        test('secureURL', () => {
          const secureURL = 'https://test.com/api/users'
          httpClient.get(secureURL).subscribe()
          httpController.expectOne(secureURL)
        })

        test('protocolRelativeURL', () => {
          const protocolRelativeURL = '//test.com/api/users'
          httpClient.get(protocolRelativeURL).subscribe()
          httpController.expectOne(protocolRelativeURL)
        })
      })
    })
  })

})
