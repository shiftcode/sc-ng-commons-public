import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core'
import { ClickOutsideDirective, SvgComponent } from '@shiftcode/ngx-components'
import { LoggerService } from '@shiftcode/ngx-core'

@Component({
    selector: 'sg-click-outside',
    imports: [
        ClickOutsideDirective,
        SvgComponent,
    ],
    templateUrl: './sg-click-outside.component.html',
    styleUrls: ['./sg-click-outside.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SgClickOutsideComponent {
  protected disabled = false
  protected outsideClickCounter = 0
  private readonly logger = inject(LoggerService).getInstance('SgClickOutsideComponent')

  protected toggleDisabled = () => this.disabled = !this.disabled

  protected onOutsideClick = (event: Event) => {
    this.outsideClickCounter++
    this.logger.debug('clicked outside', event)
  }
}
