import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, Inject, Optional } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { TOOLTIP_DEFAULT_OPTIONS, TooltipModule, TooltipOptions, TooltipPosition } from '@shiftcode/ngx-components'
import { LoggerService } from '@shiftcode/ngx-core'

@Component({
  selector: 'sg-tooltip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TooltipModule],
  templateUrl: './sg-tooltip.component.html',
  styleUrls: ['./sg-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SgTooltipComponent {
  readonly tooltip = '<b>Gefällt mir</b><br>Michael Wittwer<br>Michael Lieberherr'
  readonly tooltipPositions: TooltipPosition[] = [
    'above',
    'above-start',
    'above-end',
    'after',
    'after-start',
    'after-end',
    'before',
    'before-start',
    'before-end',
    'below',
    'below-start',
    'below-end',
  ]

  readonly positionCtrl = new FormControl<TooltipPosition>(this.tooltipPositions[0], { nonNullable: true })
  private readonly logger = inject(LoggerService).getInstance('SgTooltipComponent')

  constructor(@Optional() @Inject(TOOLTIP_DEFAULT_OPTIONS) opts: TooltipOptions) {
    this.logger.debug('tooltipDefaultOptions', opts)
  }

}
