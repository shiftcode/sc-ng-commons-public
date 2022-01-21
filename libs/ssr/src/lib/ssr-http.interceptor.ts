import { isPlatformServer } from '@angular/common'
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Inject, Injectable, PLATFORM_ID } from '@angular/core'
import { Logger, LoggerService, ORIGIN } from '@shiftcode/ngx-core'

const absoluteUrlRegex = /^[a-zA-Z\-\+.]+:\/\//

@Injectable()
export class SsrHttpInterceptor implements HttpInterceptor {
  private logger: Logger

  constructor(
    @Inject(ORIGIN) private readonly origin: string,
    @Inject(PLATFORM_ID) private platformId: any,
    loggerService: LoggerService,
  ) {
    this.logger = loggerService.getInstance('SsrHttpInterceptor')
    if (!isPlatformServer(this.platformId)) {
      throw new Error('make sure SsrHttpInterceptor is only applied on SSR')
    }
    this.logger.info(`origin for url rewrites: ${this.origin}`)
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let serverReq: HttpRequest<any> = req
    // we only want to alter the url if it's not an absolute url
    if (!absoluteUrlRegex.test(req.url)) {
      const newUrl = `${this.origin}${req.url}`
      this.logger.debug('rewrite', { from: req.url, to: newUrl })
      serverReq = req.clone({ url: newUrl })
    }
    return next.handle(serverReq)
  }
}
