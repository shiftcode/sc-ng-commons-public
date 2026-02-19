import { ErrorHandler, inject, Injectable, Injector } from '@angular/core'
import { Logger } from '@shiftcode/logger'
import { LoggerService } from '@shiftcode/ngx-core'

@Injectable()
export class LoggerErrorHandler implements ErrorHandler {
  private readonly injector = inject(Injector)

  private _logger: Logger | null = null

  private get logger(): Logger {
    // lazy initialize to prevent cyclic dependencies
    return this._logger ?? (this._logger = this.injector.get(LoggerService).getInstance('ErrorHandler'))
  }

  handleError(error: unknown): void {
    this.logger.error(error)
  }
}
