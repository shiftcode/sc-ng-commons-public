import { Subject } from 'rxjs'

import { filterIfFalsy } from './filter-if-falsy.operator'

describe('select operator', () => {
  const obj = { a: 'ok' }
  const emptyArr: any[] = []
  const emptyObj: any = {}

  test('maps the to the provided property value', () => {
    const subject = new Subject<any>()

    const onNext = jest.fn()
    subject.pipe(filterIfFalsy()).subscribe(onNext)

    subject.next(null)
    expect(onNext).toHaveBeenCalledTimes(1)

    subject.next(obj)
    subject.next(1)
    subject.next(emptyArr)
    subject.next(emptyObj)
    expect(onNext).toHaveBeenCalledTimes(1)

    subject.next(undefined)
    expect(onNext).toHaveBeenCalledWith(undefined)

    subject.next(false)
    expect(onNext).toHaveBeenCalledWith(false)

    subject.next(0)
    expect(onNext).toHaveBeenCalledWith(0)

    subject.next(NaN)
    expect(onNext).toHaveBeenCalledWith(NaN)

    subject.complete()
  })
})
