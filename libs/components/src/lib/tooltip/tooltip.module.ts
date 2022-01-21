import { A11yModule } from '@angular/cdk/a11y'
import { OverlayModule } from '@angular/cdk/overlay'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { TooltipComponent } from './tooltip.component'
import { TooltipDirective } from './tooltip.directive'

@NgModule({
  imports: [CommonModule, A11yModule, OverlayModule],
  declarations: [TooltipDirective, TooltipComponent],
  exports: [TooltipDirective],
})
export class TooltipModule {}
