import { from, isObservable, Observable, of } from 'rxjs'

/**
 * Wraps given value into an observable. If value is an observable we just return the value, values other than
 * observable will be wrapped
 */
export function wrapIntoObservable<T>(value: T | Promise<T> | Observable<T>): Observable<T> {
  if (isObservable(value)) {
    return value
  }

  if (value instanceof Promise) {
    return from(value)
  }

  return of(value)
}
