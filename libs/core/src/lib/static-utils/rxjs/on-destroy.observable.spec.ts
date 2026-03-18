import { DestroyRef, EnvironmentInjector, Injector, runInInjectionContext } from '@angular/core'
import { BehaviorSubject, takeUntil } from 'rxjs'
import { describe, expect, test, vi } from 'vitest'

import { onDestroy } from './on-destroy.observable'

describe('onDestroy', () => {
  test('should emit and complete when DestroyRef#onDestroy emits', () => {
    const injector = Injector.create({ providers: [] }) as EnvironmentInjector
    const source$ = new BehaviorSubject(0)
    const tied$ = runInInjectionContext(injector, () => source$.pipe(takeUntil(onDestroy())))

    let completed = false
    let last = 0

    tied$.subscribe({
      next(value) {
        last = value
      },
      complete() {
        completed = true
      },
    })

    source$.next(1)
    expect(last).toBe(1)

    injector.destroy()
    expect(completed).toBe(true)
    source$.next(2)
    expect(last).toBe(1)
  })

  test('should unregister listener if observable is unsubscribed', () => {
    const injector = Injector.create({ providers: [] }) as EnvironmentInjector
    const destroyRef = injector.get(DestroyRef)

    const unregisterFn = vi.fn()
    vi.spyOn(destroyRef, 'onDestroy').mockReturnValue(unregisterFn)

    const onDestroy$ = runInInjectionContext(injector, onDestroy)
    const subscription = new BehaviorSubject(0).pipe(takeUntil(onDestroy$)).subscribe()

    subscription.unsubscribe()

    expect(unregisterFn).toHaveBeenCalled()
  })

  test('throws when not used in injection context', () => {
    expect(onDestroy).toThrow()
  })
})
