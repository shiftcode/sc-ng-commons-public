import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { TooltipModule } from '@shiftcode/ngx-components'
import { SgTooltipComponent } from './sg-tooltip.component'

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, TooltipModule],
  declarations: [SgTooltipComponent],
  exports: [SgTooltipComponent],
})
export class SgTooltipModule {}
