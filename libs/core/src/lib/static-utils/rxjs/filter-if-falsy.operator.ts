import { OperatorFunction } from 'rxjs'
import { filter } from 'rxjs/operators'

export function filterIfFalsy<T>(): OperatorFunction<T | null | undefined, T> {
  return filter<T | null | undefined, T>((v): v is T => !v)
}
