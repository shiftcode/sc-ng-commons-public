import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ButtonModule, SvgModule, TooltipModule } from '@shiftcode/ngx-components'
import { SgButtonComponent } from './sg-button.component'

@NgModule({
  imports: [CommonModule, ButtonModule, SvgModule, TooltipModule],
  declarations: [SgButtonComponent],
  exports: [SgButtonComponent],
})
export class SgButtonModule {}
