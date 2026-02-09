import { from, lastValueFrom, of, scan, tap } from 'rxjs'
import { describe, expect, test, vi } from 'vitest'

import { filterIfTruthy } from './filter-if-truthy.operator'

describe('filterIfTruthy operator', () => {
  const obj = { a: 'ok' }
  const emptyArr: any[] = []
  const emptyObj: any = {}

  test('when truthy', async () => {
    const truthyValues = [true, 1, 'ok', obj, emptyArr, emptyObj]

    const values = await lastValueFrom(
      from(truthyValues).pipe(
        filterIfTruthy(),
        scan((u, i) => [...u, i], <any[]>[]),
      ),
    )
    expect(values).toEqual(truthyValues)
  })
  test('when false', () =>
    new Promise<void>((done) => {
      const falsyValues = [null, undefined, false, 0, '', NaN]

      const next = vi.fn()
      const complete = () => {
        expect(next).not.toHaveBeenCalled()
        done()
      }

      from(falsyValues).pipe(filterIfTruthy()).subscribe({ next, complete })
    }))

  test('restricts types', () => {
    of<{ z: string } | null>(null).pipe(
      filterIfTruthy(),
      tap((val) => val.z.toUpperCase()),
    )
    expect.anything()
  })
})
