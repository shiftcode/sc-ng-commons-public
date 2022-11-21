import { NgModule } from '@angular/core'
import { AutoFocusDirective } from './auto-focus.directive'

/**
 * @deprecated directly import the standalone {@link AutoFocusDirective}
 */
@NgModule({
  imports: [AutoFocusDirective],
  exports: [AutoFocusDirective],
})
export class AutoFocusModule {}
