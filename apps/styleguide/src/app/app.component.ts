import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { RouterLink, RouterOutlet } from '@angular/router'
import { FlyingFocusComponent } from '@shiftcode/ngx-components'
import { ClientIdService, LoggerService } from '@shiftcode/ngx-core'
import { Logger } from '@shiftcode/logger'
import { SUB_ROUTES } from '../routes/routes.const'

@Component({
  selector: 'sg-root',
  imports: [RouterLink, RouterOutlet, FlyingFocusComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly basePath = 'styleguide'
  protected readonly navItems = SUB_ROUTES

  private readonly logger: Logger = inject(LoggerService).getInstance('AppComponent')

  constructor() {
    const clientIdService = inject(ClientIdService)

    this.logger.debug('constructor()')
    this.logger.debug('clientId', clientIdService.clientId)
  }
}
