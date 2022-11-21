import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core'
import { AutoFocusDirective } from '@shiftcode/ngx-components'

@Component({
  selector: 'sg-sg-autofocus',
  templateUrl: './sg-autofocus.component.html',
  styleUrls: ['./sg-autofocus.component.scss'],
  standalone: true,
  imports: [CommonModule, AutoFocusDirective],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SgAutofocusComponent {}
