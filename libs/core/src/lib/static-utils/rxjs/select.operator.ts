import { map, OperatorFunction } from 'rxjs'

/**
 * maps to the value of the given property
 */
export function select<T, K extends keyof T>(key: K): OperatorFunction<T, T[K]> {
  return map<T, T[K]>((v) => v[key])
}
