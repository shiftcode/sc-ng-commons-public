import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core'
import { SvgComponent } from '@shiftcode/ngx-components'

@Component({
  selector: 'sg-sg-icon',
  imports: [SvgComponent],
  templateUrl: './sg-svg.component.html',
  styleUrls: ['./sg-svg.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SgSvgComponent {}
