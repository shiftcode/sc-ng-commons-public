import { isPlatformServer } from '@angular/common'
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Inject, Injectable, PLATFORM_ID } from '@angular/core'
import { Logger, LoggerService, ORIGIN } from '@shiftcode/ngx-core'

// absolute url with protocol -> https://
const absoluteUrlRegex = /^[a-zA-Z\-+.]+:\/\//
// absolute url with protocol relative: //domain.tld
const absoluteUrlProtocolRelativeRegex = /^\/\/([^.]+)\.([^.]+)/

/**
 * HttpInterceptor to rewrite relative urls with the provided #{@link ORIGIN} token
 */
@Injectable()
export class SsrHttpInterceptor implements HttpInterceptor {
  private logger: Logger
  private readonly origin: string

  constructor(
    @Inject(ORIGIN) origin: string,
    @Inject(PLATFORM_ID) private platformId: any,
    loggerService: LoggerService,
  ) {
    this.logger = loggerService.getInstance('SsrHttpInterceptor')
    if (!isPlatformServer(this.platformId)) {
      throw new Error('make sure SsrHttpInterceptor is only applied on SSR')
    }
    this.origin = origin.replace(/\/$/, '')
    this.logger.info(`origin for url rewrites: ${this.origin}`)
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let serverReq: HttpRequest<any> = req
    // we only want to alter the url if it's not an absolute url
    if (absoluteUrlRegex.test(req.url)) {
      // ignore
    } else if (absoluteUrlProtocolRelativeRegex.test(req.url)) {
      // do nothing but warn
      this.logger.warn(`You are using a protocol relative url (${req.url}). Consider adding a protocol.`)
    } else {
      const newUrl = `${this.origin}/${req.url.replace(/^\//, '')}`
      this.logger.debug('rewrite', { from: req.url, to: newUrl })
      serverReq = req.clone({ url: newUrl })
    }
    return next.handle(serverReq)
  }
}
