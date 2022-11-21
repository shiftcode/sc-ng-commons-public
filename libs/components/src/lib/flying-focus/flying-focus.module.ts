import { NgModule } from '@angular/core'
import { FlyingFocusComponent } from './flying-focus.component'

/**
 * @deprecated directly import the standalone {@link FlyingFocusComponent}
 */
@NgModule({
  imports: [FlyingFocusComponent],
  exports: [FlyingFocusComponent],
})
export class FlyingFocusModule {}
