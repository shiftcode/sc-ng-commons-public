import { ErrorHandler, Injectable } from '@angular/core'
import { LogLevel } from '../log-level.enum'
import { RemoteLogService } from './remote-log.service'

/**
 * Extends the angular core ErrorHandler and sends js errors to the remote logger.
 */
@Injectable({ providedIn: 'root' })
export class RemoteLogErrorHandler extends ErrorHandler {
  constructor(private remoteLogService: RemoteLogService) {
    super()
  }

  override handleError(error: any) {
    // submit error to backend
    this.remoteLogService.sendMessage(LogLevel.ERROR, 'BrowserJsException', new Date(), [error])

    // call super.handleError to print error the angular way to the console
    super.handleError(error)
  }
}
