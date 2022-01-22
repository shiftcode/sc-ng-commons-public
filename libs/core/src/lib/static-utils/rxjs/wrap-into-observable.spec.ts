import { wrapIntoObservable } from './wrap-into-observable'
import { isObservable, Observable, of } from 'rxjs'

describe('wrapIntoObservable', () => {

  test('returns observable from promise', (done) => {
    expect.assertions(2)
    const p = Promise.resolve('ok')
    const x: Observable<string> = wrapIntoObservable(p)
    expect(isObservable(x)).toBeTruthy()
    x.subscribe((v) => {
      expect(v).toBe('ok')
      done()
    })
  })

  test('returns observable from plain value', (done) => {
    expect.assertions(2)

    const val = 'ok'
    const x: Observable<string> = wrapIntoObservable(val)

    expect(isObservable(x)).toBeTruthy()
    x.subscribe((v) => {
      expect(v).toBe('ok')
      done()
    })
  })

  test('returns provided value when already an observable', () => {
    const val = of('ok')
    const x: Observable<string> = wrapIntoObservable(val)
    expect(isObservable(x)).toBeTruthy()
    expect(x).toBe(val)
  })
})
