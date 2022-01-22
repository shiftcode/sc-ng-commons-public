import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { TextareaAutosizeDirective } from './textarea-autosize.directive'

@NgModule({
  imports: [CommonModule],
  declarations: [TextareaAutosizeDirective],
  exports: [TextareaAutosizeDirective],
})
export class TextareaAutosizeModule {}
