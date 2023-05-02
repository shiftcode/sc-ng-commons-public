import { NgModule } from '@angular/core'
import { TextareaAutosizeDirective } from './textarea-autosize.directive'

/**
 * @deprecated directly import the standalone {@link TextareaAutosizeDirective}
 */
@NgModule({
  imports: [TextareaAutosizeDirective],
  exports: [TextareaAutosizeDirective],
})
export class TextareaAutosizeModule {}
