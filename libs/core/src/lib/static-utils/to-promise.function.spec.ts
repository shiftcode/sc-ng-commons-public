import { from } from 'rxjs'

import { toPromise } from './to-promise.function'

describe('toPromise', () => {
  test('returns a promise if a promise is passed', async () => {
    const aValue = { str: 'Hello Promise' } as const
    const promise = Promise.resolve(aValue)
    const res = toPromise(promise)

    expect(res).toBeInstanceOf(Promise)
    await expect(res).resolves.toBe(aValue)
  })

  // /**
  //  * this test will not work since we use zone.js
  //  * zone.js patches the Promise and Promise.resolve will not return the very same instance (as it would without zone)
  //  */
  // xtest('returns the same instance if a promise is passed', () => {
  //   const promise = Promise.resolve('Hello World')
  //   expect(toPromise(promise)).toBe(promise)
  // })

  test('returns a resolved promise with the first value emission if the value is an observable', async () => {
    const firstValue = 'Hello World'
    const obs = from([firstValue, 'second value'])
    const res = toPromise(obs)

    expect(res).toBeInstanceOf(Promise)
    await expect(res).resolves.toBe(firstValue)
  })

  test('returns a resolved promise if the value is neither observable nor a promise', async () => {
    const value = { foo: 'bar' } as const
    const res = toPromise(value)

    expect(res).toBeInstanceOf(Promise)
    await expect(res).resolves.toBe(value)
  })
})
