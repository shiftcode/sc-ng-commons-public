import { Pipe, PipeTransform } from '@angular/core'

/**
 * generic pipe to call one-param functions from template and make use of angular pure pipe optimization.
 * @example
 * ```angular-html
 *   {{ myDate | apply: myDateFormatter }}
 * ```
 */
@Pipe({ name: 'apply' })
export class ApplyPipe implements PipeTransform {
  transform<T, R>(value: T, fn: (arg: T) => R): R {
    return fn(value)
  }
}
