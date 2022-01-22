import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SvgModule } from '@shiftcode/ngx-components'
import { SgSvgComponent } from './sg-svg.component'


@NgModule({
  imports: [CommonModule, SvgModule],
  declarations: [SgSvgComponent],
  exports: [SgSvgComponent],
})
export class SgSvgModule {}
