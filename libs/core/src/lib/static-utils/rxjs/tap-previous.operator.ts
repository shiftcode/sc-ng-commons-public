import { defer, MonoTypeOperatorFunction, tap } from 'rxjs'

const NOOP = Symbol.for('NOOP')

export function tapPrevious<T>(fn: (value: T) => void): MonoTypeOperatorFunction<T> {
  return (source) =>
    defer(() => {
      let prev: T | typeof NOOP = NOOP
      return source.pipe(
        tap((payload) => {
          if (prev !== NOOP) {
            fn(prev)
          }
          prev = payload
        }),
      )
    })
}
