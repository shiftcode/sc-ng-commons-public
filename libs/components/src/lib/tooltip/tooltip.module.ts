import { NgModule } from '@angular/core'
import { TooltipComponent } from './tooltip.component'
import { TooltipDirective } from './tooltip.directive'

/**
 * @deprecated directly import the standalone {@link TooltipDirective}
 */
@NgModule({
  imports: [TooltipDirective, TooltipComponent],
  exports: [TooltipDirective],
})
export class TooltipModule {}
