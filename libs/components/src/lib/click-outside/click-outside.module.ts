import { NgModule } from '@angular/core'
import { ClickOutsideDirective } from './click-outside.directive'

/**
 * @deprecated directly import the standalone {@link ClickOutsideDirective}
 */
@NgModule({
  imports: [ClickOutsideDirective],
  exports: [ClickOutsideDirective],
})
export class ClickOutsideModule {}
