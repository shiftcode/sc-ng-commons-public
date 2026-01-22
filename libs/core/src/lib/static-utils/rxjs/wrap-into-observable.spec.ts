import { makeDeferred } from '@shiftcode/utilities'
import { isObservable, Observable, of } from 'rxjs'
import { describe, expect, it } from 'vitest'

import { wrapIntoObservable } from './wrap-into-observable'

describe('wrapIntoObservable', () => {
  it('returns observable from promise', async () => {
    const p = Promise.resolve('ok')
    const x: Observable<string> = wrapIntoObservable(p)
    expect(isObservable(x)).toBeTruthy()

    const { promise, resolve } = makeDeferred()
    x.subscribe(resolve)
    await expect(promise).resolves.toBe('ok')
  })

  it('returns observable from plain value', async () => {
    const val = 'ok'
    const x: Observable<string> = wrapIntoObservable(val)

    expect(isObservable(x)).toBeTruthy()

    const { promise, resolve } = makeDeferred<string>()

    x.subscribe(resolve)

    await expect(promise).resolves.toBe('ok')
  })

  it('returns provided value when already an observable', () => {
    const val = of('ok')
    const x: Observable<string> = wrapIntoObservable(val)
    expect(isObservable(x)).toBeTruthy()
    expect(x).toBe(val)
  })
})
