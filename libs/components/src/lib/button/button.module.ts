import { NgModule } from '@angular/core'
import { ButtonComponent } from './button.component'

/**
 * @deprecated directly import the standalone {@link ButtonComponent}
 */
@NgModule({
  imports: [ButtonComponent],
  exports: [ButtonComponent],
})
export class ButtonModule {}
