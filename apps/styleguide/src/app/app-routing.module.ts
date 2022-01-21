import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SgAutofocusComponent } from './routes/sg-autofocus/sg-autofocus.component'
import { SgAutofocusModule } from './routes/sg-autofocus/sg-autofocus.module'
import { SgButtonComponent } from './routes/sg-button/sg-button.component'
import { SgButtonModule } from './routes/sg-button/sg-button.module'
import { SgSmoothHeightComponent } from './routes/sg-smooth-height/sg-smooth-height.component'
import { SgSmoothHeightModule } from './routes/sg-smooth-height/sg-smooth-height.module'
import { SgSvgComponent } from './routes/sg-svg/sg-svg.component'
import { SgSvgModule } from './routes/sg-svg/sg-svg.module'
import { SgTextAreaAutosizeComponent } from './routes/sg-textarea-autosize/sg-text-area-autosize.component'
import { SgTextareaAutosizeModule } from './routes/sg-textarea-autosize/sg-textarea-autosize.module'
import { SgTooltipComponent } from './routes/sg-tooltip/sg-tooltip.component'
import { SgTooltipModule } from './routes/sg-tooltip/sg-tooltip.module'

const APP_ROUTES: Routes = [
  {
    path: 'styleguide',
    children: [
      { path: 'button', component: SgButtonComponent },
      { path: 'smoothHeight', component: SgSmoothHeightComponent },
      { path: 'tooltip', component: SgTooltipComponent },
      { path: 'textarea', component: SgTextAreaAutosizeComponent },
      { path: 'autofocus', component: SgAutofocusComponent },
      { path: 'svg', component: SgSvgComponent },
      { path: '**', redirectTo: 'button' },
    ],
  },
  { path: '**', redirectTo: 'styleguide' },
]

@NgModule({
  imports: [
    SgButtonModule,
    SgSmoothHeightModule,
    SgTooltipModule,
    SgTextareaAutosizeModule,
    SgAutofocusModule,
    SgSvgModule,
    RouterModule.forRoot(APP_ROUTES),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

