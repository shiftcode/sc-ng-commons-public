import { of, Subject, tap } from 'rxjs'
import { filterIfTruthy } from './filter-if-truthy.operator'


describe('select operator', () => {
  const obj = { a: 'ok' }
  const emptyArr: any[] = []
  const emptyObj: any = {}

  test('maps the to the provided property value', () => {
    const subject = new Subject<any>()

    const onNext = jest.fn()
    subject.pipe(filterIfTruthy()).subscribe(onNext)

    subject.next(obj)
    expect(onNext).toHaveBeenCalledWith(obj)

    subject.next(null)
    subject.next(undefined)
    subject.next(false)
    subject.next(0)
    subject.next(NaN)
    expect(onNext).toHaveBeenCalledTimes(1)

    subject.next(1)
    expect(onNext).toHaveBeenCalledWith(1)

    subject.next(emptyArr)
    expect(onNext).toHaveBeenCalledWith(emptyArr)

    subject.next(emptyObj)
    expect(onNext).toHaveBeenCalledWith(emptyObj)

    subject.complete()
  })

  test('restricts types', () => {
    of<{ z: string } | null>(null)
      .pipe(
        filterIfTruthy(),
        tap((val) => val.z.toUpperCase()),
      )
    expect.anything()
  })

})
