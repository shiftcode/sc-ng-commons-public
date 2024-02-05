import { Routes } from '@angular/router'
import { SgAutofocusComponent } from './sg-autofocus/sg-autofocus.component'
import { SgButtonComponent } from './sg-button/sg-button.component'
import { SgClickOutsideComponent } from './sg-click-outside/sg-click-outside.component'
import { SgLocalStorageComponent } from './sg-local-storage/sg-local-storage.component'
import { SgRxComponent } from './sg-rx/sg-rx.component'
import { SgSmoothHeightComponent } from './sg-smooth-height/sg-smooth-height.component'
import { SgSvgComponent } from './sg-svg/sg-svg.component'
import { SgTextAreaAutosizeComponent } from './sg-textarea-autosize/sg-text-area-autosize.component'
import { SgTooltipComponent } from './sg-tooltip/sg-tooltip.component'

export const SUB_ROUTES = [
  { path: 'button', component: SgButtonComponent, title: 'Button' },
  { path: 'smooth-height', component: SgSmoothHeightComponent, title: 'Smooth Height' },
  { path: 'tooltip', component: SgTooltipComponent, title: 'Tooltip' },
  { path: 'textarea', component: SgTextAreaAutosizeComponent, title: 'Textarea Autosize' },
  { path: 'autofocus', component: SgAutofocusComponent, title: 'Autofocus' },
  { path: 'svg', component: SgSvgComponent, title: 'SVG' },
  { path: 'local-storage', component: SgLocalStorageComponent, title: 'LocalStorage' },
  { path: 'click-outside', component: SgClickOutsideComponent, title: 'ClickOutside' },
  { path: 'rx', component: SgRxComponent, title: 'RX' },

  { path: 'just-a-test-route', title: 'Test', loadChildren: () => import('./sg-test-page/sg-test-page.routes') },
] satisfies Routes

export const ROUTES = [
  {
    path: 'styleguide',
    children: [
      ...SUB_ROUTES,
      { path: '**', redirectTo: SUB_ROUTES[0].path },
    ],
  },
  { path: '**', redirectTo: 'styleguide' },
] satisfies Routes
