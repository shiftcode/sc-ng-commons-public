import { NgModule } from '@angular/core'
import { SmoothHeightComponent } from './smooth-height.component'

/**
 * @deprecated directly import the standalone {@link SmoothHeightComponent}
 */
@NgModule({
  imports: [SmoothHeightComponent],
  exports: [SmoothHeightComponent],
})
export class SmoothHeightModule {}
