import { filter, OperatorFunction } from 'rxjs'

export function filterIfFalsy<T>(): OperatorFunction<T | null | undefined, T> {
  return filter<T | null | undefined, T>((v): v is T => !v)
}
