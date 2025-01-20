import { CanActivateFn, Routes } from '@angular/router'
import { SgTestPageSub1Component } from './sg-test-page-sub-1/sg-test-page-sub-1.component'
import { SgTestPageSub2Component } from './sg-test-page-sub-2/sg-test-page-sub-2.component'
import { SgTestRouteQueryParams } from './sg-test-route-query-params.enum'

const canActivateByQueryParam: CanActivateFn = async (ars) => {
  const delay = Number(ars.queryParams[SgTestRouteQueryParams.DELAY] ?? 0)
  const disallow = ars.queryParams[SgTestRouteQueryParams.DISALLOW] === 'true'
  await new Promise((resolve) => setTimeout(resolve, delay))
  return !disallow
}

const ROUTES: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivateChild: [canActivateByQueryParam],
    children: [
      { path: '', pathMatch: 'full', redirectTo: '1' },
      { path: '1', component: SgTestPageSub1Component },
      { path: '2', component: SgTestPageSub2Component },
    ],
  },
]

export default ROUTES
