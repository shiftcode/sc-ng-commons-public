import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { mapValuesDeep } from '@shiftcode/utilities'
import { map, Observable } from 'rxjs'

import { REGEX_DATE_STRING, REGEX_DATE_STRING_WITH_MS } from '../static-utils/regex'

@Injectable({ providedIn: 'root' })
export class HttpDateInterceptor implements HttpInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  static convertDates(value: string | any): Date | any {
    if (typeof value === 'string' && (REGEX_DATE_STRING.test(value) || REGEX_DATE_STRING_WITH_MS.test(value))) {
      return new Date(value)
    } else {
      return value
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.responseType === 'json') {
      return next.handle(req).pipe(map(this.mapResponse.bind(this)))
    } else {
      return next.handle(req)
    }
  }

  mapResponse(response: HttpEvent<any>): HttpEvent<any> {
    if (response instanceof HttpResponse && response.status >= 200 && response.status < 300) {
      const body = mapValuesDeep(response.body, HttpDateInterceptor.convertDates)
      return response.clone({ body })
    } else {
      return response
    }
  }
}
