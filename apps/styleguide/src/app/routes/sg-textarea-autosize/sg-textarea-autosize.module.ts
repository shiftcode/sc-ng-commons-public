import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { TextareaAutosizeModule } from '@shiftcode/ngx-components'
import { SgTextAreaAutosizeComponent } from './sg-text-area-autosize.component'


@NgModule({
  imports: [CommonModule, ReactiveFormsModule, TextareaAutosizeModule],
  declarations: [SgTextAreaAutosizeComponent],
  exports: [SgTextAreaAutosizeComponent],
})
export class SgTextareaAutosizeModule {}
