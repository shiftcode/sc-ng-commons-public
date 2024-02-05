import { ResolveFn } from '@angular/router'
import { resolveFnToCanActivateFn } from './resolve-fn-to-can-activate-fn.function'

describe('resolveFnToCanActivateFn', () => {
  const resolver1: ResolveFn<any> = () => Promise.resolve({ foo: 'bar' })

  test('returns a function', () => {
    const guard = resolveFnToCanActivateFn(resolver1)
    expect(guard).toBeInstanceOf(Function)
  })
})
