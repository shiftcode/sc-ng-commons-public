import { assertInInjectionContext, DestroyRef, inject } from '@angular/core'
import { Observable } from 'rxjs'

/**
 * Factory which returns an observable which will emit and complete when the current
 * angular context is destroyed. Uses the {@link DestroyRef} injectable from @angular/core.
 * Can only be called within an injection context.
 *
 * @example ```ts
 * import { Directive } from '@angular/core'
 * import { onDestroy } from '@shiftcode/ngx-core-utils'
 *
 * @Directive()
 * export class MyDirective {
 *   // usage as observable on a member, so it can be used multiple times
 *   protected readonly onDestroy$ = onDestroy()
 *
 *   constructor() {
 *     inject(MyApi).getUpdates()
 *       .pipe(takeUntil(this.onDestroy$))
 *       .subscribe(console.log)
 *   }
 * }
 */
export function onDestroy(): Observable<void> {
  assertInInjectionContext(onDestroy)
  const destroyRef = inject(DestroyRef)
  return new Observable<void>((observer) => {
    // returns the unregisterFn
    return destroyRef.onDestroy(() => {
      observer.next()
      observer.complete()
    })
  })
}
