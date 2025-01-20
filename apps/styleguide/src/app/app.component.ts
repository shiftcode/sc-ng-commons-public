import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { RouterLink, RouterOutlet } from '@angular/router'
import { FlyingFocusComponent } from '@shiftcode/ngx-components'
import { ClientIdService, Logger, LoggerService } from '@shiftcode/ngx-core'
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

  constructor(clientIdService: ClientIdService) {
    this.logger.debug('constructor()')
    this.logger.debug('clientId', clientIdService.clientId)
  }
}
