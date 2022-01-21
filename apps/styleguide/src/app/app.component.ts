import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ClientIdService, Logger, LoggerService } from '@shiftcode/ngx-core'

@Component({
  selector: 'sg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly navItems: ReadonlyArray<string> = [
    'button',
    'smoothHeight',
    'tooltip',
    'textarea',
    'autofocus',
    'svg'
  ]

  private readonly logger: Logger

  constructor(loggerService: LoggerService,
              clientIdService: ClientIdService) {

    this.logger = loggerService.getInstance('AppComponent')
    this.logger.debug('constructor()')
    this.logger.debug('clientId', clientIdService.clientId)
  }
}
