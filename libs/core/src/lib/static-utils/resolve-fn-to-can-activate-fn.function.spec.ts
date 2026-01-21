import { ResolveFn } from '@angular/router'
import { describe, it, expect } from 'vitest'

import { resolveFnToCanActivateFn } from './resolve-fn-to-can-activate-fn.function'

describe('resolveFnToCanActivateFn', () => {
  const resolver1: ResolveFn<any> = () => Promise.resolve({ foo: 'bar' })

  it('returns a function', () => {
    const guard = resolveFnToCanActivateFn(resolver1)
    expect(guard).toBeInstanceOf(Function)
  })
})
