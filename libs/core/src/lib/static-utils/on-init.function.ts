import { effect, EffectCleanupFn, untracked } from '@angular/core'

/**
 * Utility function to replace ngOnInit method.
 * Runs as an effect exactly once and uses the returned function as the cleanup, which will be executed onDestroy
 * Needs to be run in an injection context (e.g. in your constructor).
 *
 * @example
 * ```ts
 *   onInit(() => {
 *     const subscription = someObservable.subscribe(...)
 *     return () => subscription.unsubscribe()
 *   })
 * ```
 */
export function onInit(initFn: () => void | EffectCleanupFn) {
  // we use `untracked` to ensure the effect is called only once as no dependency will re-trigger it.
  // the cleanup is then effectively called in the ngOnDestroy lifecycle.
  effect((onCleanup) => {
    const cleanup = untracked(initFn)
    if (typeof cleanup === 'function') {
      onCleanup(cleanup)
    }
  })
}
