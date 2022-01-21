import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AutoFocusModule } from '@shiftcode/ngx-components'
import { SgAutofocusComponent } from './sg-autofocus.component'


@NgModule({
  imports: [CommonModule, AutoFocusModule],
  declarations: [SgAutofocusComponent],
  exports: [SgAutofocusComponent],
})
export class SgAutofocusModule {}
