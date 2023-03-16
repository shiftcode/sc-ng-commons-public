import { Routes } from '@angular/router'
import { SgAutofocusComponent } from './sg-autofocus/sg-autofocus.component'
import { SgButtonComponent } from './sg-button/sg-button.component'
import { SgSmoothHeightComponent } from './sg-smooth-height/sg-smooth-height.component'
import { SgSvgComponent } from './sg-svg/sg-svg.component'
import { SgTextAreaAutosizeComponent } from './sg-textarea-autosize/sg-text-area-autosize.component'
import { SgTooltipComponent } from './sg-tooltip/sg-tooltip.component'

export const SUB_ROUTES: Routes = [
  { path: 'button', component: SgButtonComponent, title: 'Button' },
  { path: 'smoothHeight', component: SgSmoothHeightComponent, title: 'Smooth Height' },
  { path: 'tooltip', component: SgTooltipComponent, title: 'Tooltip' },
  { path: 'textarea', component: SgTextAreaAutosizeComponent, title: 'Textarea Autosize' },
  { path: 'autofocus', component: SgAutofocusComponent, title: 'Autofocus' },
  { path: 'svg', component: SgSvgComponent, title: 'SVG' },
]

export const ROUTES: Routes = [
  {
    path: 'styleguide',
    children: [
      ...SUB_ROUTES,
      { path: '**', redirectTo: SUB_ROUTES[0].path },
    ],
  },
  { path: '**', redirectTo: 'styleguide' },
]
