import { NgModule } from '@angular/core'
import { SvgAnimateDirective } from './svg-animate.directive'

/**
 * @deprecated directly import the standalone {@link SvgAnimateDirective}
 */
@NgModule({
  imports: [SvgAnimateDirective],
  exports: [SvgAnimateDirective],
})
export class SvgAnimateModule {}
