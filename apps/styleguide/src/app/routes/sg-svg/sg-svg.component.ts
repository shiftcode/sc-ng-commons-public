import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core'

@Component({
  selector: 'sg-sg-icon',
  templateUrl: './sg-svg.component.html',
  styleUrls: ['./sg-svg.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SgSvgComponent {}
