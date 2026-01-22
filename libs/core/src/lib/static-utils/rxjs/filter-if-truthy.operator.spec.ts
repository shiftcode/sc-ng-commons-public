import { from, lastValueFrom, of, tap } from 'rxjs'
import { describe, expect, it, vi } from 'vitest'

import { filterIfTruthy } from './filter-if-truthy.operator'

describe('filterIfTruthy operator', () => {
  const obj = { a: 'ok' }
  const emptyArr: any[] = []
  const emptyObj: any = {}

  it('when truthy', async () => {
    const truthyValues = [true, 1, 'ok', obj, emptyArr, emptyObj]

    const next = vi.fn()

    await lastValueFrom(from(truthyValues).pipe(filterIfTruthy(), tap(next)))

    expect(next).toHaveBeenCalledTimes(truthyValues.length)
  })

  it('when false', async () => {
    const falsyValues = [null, undefined, false, 0, '', NaN]

    const next = vi.fn()

    await lastValueFrom(from(falsyValues).pipe(filterIfTruthy(), tap(next)), { defaultValue: undefined })

    expect(next).not.toHaveBeenCalled()
  })

  it('restricts types', () => {
    of<{ z: string } | null>(null).pipe(
      filterIfTruthy(),
      tap((val) => val.z.toUpperCase()),
    )
    expect.anything()
  })
})
