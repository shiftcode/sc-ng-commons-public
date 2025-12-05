import { CanActivateFn, createUrlTreeFromSnapshot, ResolveFn } from '@angular/router'

import { toPromise } from './to-promise.function'

/**
 * takes an angular {@link ResolveFn} and returns a {@link CanActivateFn}
 * by simply wrapping the ResolveFn and applying a truthy check on its result (with `!!result`)
 * @returns true or a {@link RouterTree} which is relative to the current routeSnapshot.
 * @example
 * ```ts
 *  const resolveFn: ResolveFn<MyDto|null> = (route: ActivatedRouteSnapshot) => inject(MyApi).fetch(route.params.id)
 *  const canActivateFn: CanActivateFn = resolveFnToCanActivateFn(resolveFn, ['..', 'relative-other-route'])
 *  ```
 */
export function resolveFnToCanActivateFn<T extends object>(
  resolveFn: ResolveFn<T | null | undefined>,
  relativeRouteRedirect: any[] = ['..'],
): CanActivateFn {
  return (r, s) => toPromise(resolveFn(r, s)).then((v) => !!v || createUrlTreeFromSnapshot(r, relativeRouteRedirect))
}
