import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpInterceptor,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { ClassProvider } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { firstValueFrom } from 'rxjs'
import { HttpDateInterceptor } from './http-date.interceptor'

describe('HttpDateInterceptor', () => {
  const momentInterceptorProvider: ClassProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpDateInterceptor,
    multi: true,
  }
  let interceptor: HttpDateInterceptor
  let httpClient: HttpClient
  let httpController: HttpTestingController
  let mapResponseSpy: jest.SpyInstance

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [momentInterceptorProvider, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    })
    interceptor = <HttpDateInterceptor>(
      TestBed.inject<HttpInterceptor[]>(HTTP_INTERCEPTORS).find((i) => i instanceof HttpDateInterceptor)!
    )
    httpClient = TestBed.inject(HttpClient)
    httpController = TestBed.inject(HttpTestingController)
    mapResponseSpy = jest.spyOn(interceptor, 'mapResponse')
  })

  test('maps dates on response 200', async () => {
    const expected: any = {
      createdAt: new Date(0),
      nested: {
        updatedAt: new Date(),
      },
    }
    const body: any = JSON.parse(JSON.stringify(expected))

    const request = firstValueFrom(httpClient.get('/test'))
    httpController.expectOne('/test').flush(body)

    const response: any = await request
    expect(mapResponseSpy).toHaveBeenCalled() // hint: it's called twice
    expect(response.createdAt).toBeInstanceOf(Date)
    expect(response.nested.updatedAt).toBeInstanceOf(Date)
    expect(response).toEqual(expected)
  })

  test('does not map when not json requested', async () => {
    const request = firstValueFrom(httpClient.get('/test', { responseType: 'text' }))
    httpController.expectOne('/test').flush('just text content', { headers: { 'Content-Type': 'text/plain' } })
    await request
    expect(mapResponseSpy).not.toHaveBeenCalled()
  })
})
