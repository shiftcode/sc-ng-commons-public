import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { LoggerService, ORIGIN } from '@shiftcode/ngx-core'

// absolute url with protocol -> https://
const absoluteUrlRegex = /^[a-zA-Z\-+.]+:\/\//
// absolute url with protocol relative: //domain.tld
const absoluteUrlProtocolRelativeRegex = /^\/\/([^.]+)\.([^.]+)/

const logger = () => inject(LoggerService).getInstance('OriginHttpInterceptor')

export const originHttpInterceptor: HttpInterceptorFn = (req, next) => {
  if (absoluteUrlRegex.test(req.url)) {
    return next(req)
  } else if (absoluteUrlProtocolRelativeRegex.test(req.url)) {
    logger().warn(`You are using a protocol relative url (${req.url}) - consider adding a protocol.`)
    return next(req)
  } else {
    return next(req.clone({ url: `${inject(ORIGIN)}/${req.url.replace(/^\//, '')}` }))
  }
}
