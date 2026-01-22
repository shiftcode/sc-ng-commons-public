import { ErrorHandler, inject, Injectable, Injector } from '@angular/core'
import { LogLevel } from '@shiftcode/logger'

import { CloudWatchServiceV2 } from './cloud-watch.service'

/**
 * Angular ErrorHandler to send uncaught Errors to AWS CloudWatch Logs
 * requires the {@link CloudWatchServiceV2}
 */
@Injectable({ providedIn: 'root' })
export class CloudWatchErrorHandlerV2 extends ErrorHandler {
  private readonly injector = inject(Injector)

  override handleError(error: any): void {
    // prevent cyclic dependencies (eg. when CLOUD_WATCH_LOG_TRANSPORT_CONFIG needs config from httpClient request)
    const cws = this.injector.get(CloudWatchServiceV2)
    cws.addMessage(LogLevel.ERROR, 'BrowserJsException', new Date(), [error])

    // call super.handleError to print error the angular way to the console
    super.handleError(error)
  }
}
