import { HttpClient, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http'
import { ensureOriginInterceptor } from './ensure-origin.interceptor'
import { TestBed } from '@angular/core/testing'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { ORIGIN } from './origin.token'

describe('ensureOriginInterceptor', () => {
  const origin = 'https://example.com'

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ORIGIN, useValue: origin },
        provideHttpClient(withInterceptors([ensureOriginInterceptor])),
        provideHttpClientTesting(),
      ],
    })
  })

  it('should prepend origin to relative URLs', () => {
    const req = new HttpRequest('GET', '/api/data')

    const nextSpy = jest.fn()
    TestBed.runInInjectionContext(() => ensureOriginInterceptor(req, nextSpy))
    expect(nextSpy).toHaveBeenCalledWith(expect.objectContaining({ url: `${origin}/api/data` }))
  })

  it('should not modify absolute URLs', () => {
    const req = new HttpRequest('GET', 'https://other.com/api/data')

    const nextSpy = jest.fn()
    TestBed.runInInjectionContext(() => ensureOriginInterceptor(req, nextSpy))
    expect(nextSpy).toHaveBeenCalledWith(req)
  })

  it('should work integrated with HttpClient', () => {
    const controller = TestBed.inject(HttpTestingController)
    const httpClient = TestBed.inject(HttpClient)

    httpClient.get('/api/data').subscribe()

    const req = controller.expectOne(`${origin}/api/data`)
    expect(req.request.url).toBe(`${origin}/api/data`)
    req.flush('ok')
  })
})
