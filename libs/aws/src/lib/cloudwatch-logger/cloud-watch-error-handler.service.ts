import { ErrorHandler, Injectable, Injector } from '@angular/core'
import { LogLevel } from '@shiftcode/ngx-core'
import { CloudWatchService } from './cloud-watch.service'

@Injectable({ providedIn: 'root' })
export class CloudWatchErrorHandlerService extends ErrorHandler {
  constructor(private readonly injector: Injector) {
    super()
  }

  handleError(error: any): void {
    // prevent cyclic dependencies (eg. when CLOUD_WATCH_LOG_TRANSPORT_CONFIG needs config from httpClient request)
    const cws = this.injector.get(CloudWatchService)
    cws.addMessage(LogLevel.ERROR, 'BrowserJsException', new Date(), [error])

    // call super.handleError to print error the angular way to the console
    super.handleError(error)
  }
}
