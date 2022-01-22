import { ErrorHandler, Injectable, Injector } from '@angular/core'
import { LogLevel } from '@shiftcode/ngx-core'
import { CloudWatchService } from './cloud-watch.service'

/**
 * Angular ErrorHandler to send uncaught Errors to AWS CloudWatch Logs
 * requires the {@link CloudWatchService}
 */
@Injectable({ providedIn: 'root' })
export class CloudWatchErrorHandler extends ErrorHandler {
  constructor(private readonly injector: Injector) {
    super()
  }

  override handleError(error: any): void {
    // prevent cyclic dependencies (eg. when CLOUD_WATCH_LOG_TRANSPORT_CONFIG needs config from httpClient request)
    const cws = this.injector.get(CloudWatchService)
    cws.addMessage(LogLevel.ERROR, 'BrowserJsException', new Date(), [error])

    // call super.handleError to print error the angular way to the console
    super.handleError(error)
  }
}
