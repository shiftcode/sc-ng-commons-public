import { from, of, scan, tap } from 'rxjs'
import { filterIfTruthy } from './filter-if-truthy.operator'

describe('filterIfTruthy operator', () => {
  const obj = { a: 'ok' }
  const emptyArr: any[] = []
  const emptyObj: any = {}

  test('when truthy', (done) => {
    const truthyValues = [true, 1, 'ok', obj, emptyArr, emptyObj]

    from(truthyValues)
      .pipe(
        filterIfTruthy(),
        scan((u, i) => [...u, i], <any[]>[]),
      )
      .subscribe({
        next: (values) => {
          expect(values).toEqual(truthyValues)
        },
        complete: done,
      })
  })
  test('when false', (done) => {
    const falsyValues = [null, undefined, false, 0, '', NaN]

    const next = jest.fn()
    const complete = () => {
      expect(next).not.toHaveBeenCalled()
      done()
    }

    from(falsyValues).pipe(filterIfTruthy()).subscribe({ next, complete })
  })

  test('restricts types', () => {
    of<{ z: string } | null>(null).pipe(
      filterIfTruthy(),
      tap((val) => val.z.toUpperCase()),
    )
    expect.anything()
  })
})
