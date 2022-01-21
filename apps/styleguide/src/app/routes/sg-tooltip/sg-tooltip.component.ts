import { ChangeDetectionStrategy, Component, Inject, Optional } from '@angular/core'
import { FormControl } from '@angular/forms'
import { TOOLTIP_DEFAULT_OPTIONS, TooltipOptions, TooltipPosition } from '@shiftcode/ngx-components'
import { Logger, LoggerService } from '@shiftcode/ngx-core'

@Component({
  selector: 'sg-tooltip',
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

  readonly positionCtrl = new FormControl(this.tooltipPositions[0])
  private readonly logger: Logger

  constructor(loggerService: LoggerService, @Optional() @Inject(TOOLTIP_DEFAULT_OPTIONS) opts:TooltipOptions) {
    this.logger = loggerService.getInstance('SgTooltipComponent')
    this.logger.debug('tooltipDefaultOptions', opts)
  }

}
