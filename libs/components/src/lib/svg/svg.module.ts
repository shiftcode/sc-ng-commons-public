import { NgModule } from '@angular/core'
import { SvgComponent } from './svg.component'

/**
 * @deprecated directly import the standalone {@link SvgComponent}
 */
@NgModule({
  imports: [SvgComponent],
  exports: [SvgComponent],
})
export class SvgModule {}
