import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { ORIGIN } from './origin.token'

/**
 * An interceptor function that prepends the origin to requests with a relative url.
 * it is important that ssr and browser both use the origin for requests otherwise we get different TransferState keys
 * and the ssr state is not found in the browser.
 */
export const ensureOriginInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/')) {
    const origin = inject(ORIGIN)

    const clonedReq = req.clone({ url: `${origin}${req.url}` })
    return next(clonedReq)
  }
  return next(req)
}
