import { firstValueFrom, isObservable, type Observable } from 'rxjs'

/**
 * returns the given value as a Promise.
 * uses {@link firstValueFrom} if the value is an {@link Observable}
 * uses Promise.resolve(value) otherwise (plain value is converted to a Promise, a promise stats a promise).
 * @hint
 * Promise.resolve would return the promise itself if the provided value already is a Promise.
 * When using zone.js which patches the native Promise, the returned promise is never the same as the provided one since it will patch it.
 */
export function toPromise<T>(value: T | Observable<T> | Promise<T>): Promise<T> {
  return isObservable(value) ? firstValueFrom(value) : Promise.resolve(value)
}
