import { filter, OperatorFunction } from 'rxjs'

export function filterIfTruthy<T>(): OperatorFunction<T | null | undefined, T> {
  return filter<T | null | undefined, T>((v): v is T => !!v)
}
