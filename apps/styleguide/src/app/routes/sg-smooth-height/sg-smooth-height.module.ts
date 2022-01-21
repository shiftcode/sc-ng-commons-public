import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SmoothHeightModule } from '@shiftcode/ngx-components'
import { SgSmoothHeightComponent } from './sg-smooth-height.component'

@NgModule({
  imports: [CommonModule, SmoothHeightModule],
  declarations: [SgSmoothHeightComponent],
  exports: [SgSmoothHeightComponent],
})
export class SgSmoothHeightModule {}
