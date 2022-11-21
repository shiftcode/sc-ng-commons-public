import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { RouterModule } from '@angular/router'
import { FlyingFocusComponent } from '@shiftcode/ngx-components'
import { ClientIdService, Logger, LoggerService } from '@shiftcode/ngx-core'
import { SUB_ROUTES } from '../routes/routes.const'

@Component({
  selector: 'sg-root',
  standalone: true,
  imports: [CommonModule, RouterModule, FlyingFocusComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly navItems = SUB_ROUTES

  private readonly logger: Logger = inject(LoggerService).getInstance('AppComponent')

  constructor(clientIdService: ClientIdService) {
    this.logger.debug('constructor()')
    this.logger.debug('clientId', clientIdService.clientId)
  }
}
