import { ErrorHandler, Injectable, inject } from '@angular/core'
import { LogLevel } from '@shiftcode/logger'
import { RemoteLogService } from './remote-log.service'

/**
 * Extends the angular core ErrorHandler and sends js errors to the remote logger.
 */
@Injectable({ providedIn: 'root' })
export class RemoteLogErrorHandler extends ErrorHandler {
  private readonly remoteLogService = inject(RemoteLogService)

  override handleError(error: any) {
    // submit error to backend
    this.remoteLogService.sendMessage(LogLevel.ERROR, 'BrowserJsException', new Date(), [error])

    // call super.handleError to print error the angular way to the console
    super.handleError(error)
  }
}
