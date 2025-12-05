import { DestroyRef, EnvironmentInjector, Injector, runInInjectionContext } from '@angular/core'
import { BehaviorSubject, takeUntil } from 'rxjs'

import { onDestroy } from './on-destroy.observable'

describe('onDestroy', () => {
  it('should emit and complete when DestroyRef#onDestroy emits', () => {
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

  it('should unregister listener if observable is unsubscribed', () => {
    const injector = Injector.create({ providers: [] }) as EnvironmentInjector
    const destroyRef = injector.get(DestroyRef)

    const unregisterFn = jest.fn()
    jest.spyOn(destroyRef, 'onDestroy').mockReturnValue(unregisterFn)

    const onDestroy$ = runInInjectionContext(injector, onDestroy)
    const subscription = new BehaviorSubject(0).pipe(takeUntil(onDestroy$)).subscribe()

    subscription.unsubscribe()

    expect(unregisterFn).toHaveBeenCalled()
  })

  it('throws when not used in injection context', () => {
    expect(onDestroy).toThrow()
  })
})
