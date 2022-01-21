// tslint:disable:max-classes-per-file

import { filterIfInstanceOf } from './filter-if-instance-of.operator'
import { of, Subject } from 'rxjs'
import { tap } from 'rxjs/operators'

abstract class Base {
  abstract type: 'A' | 'B'
}

class A extends Base {
  type: 'A'

  get a() { return this.type }
}

class B extends Base {
  type: 'B'

  get b() { return this.type }
}

describe('filterIfInstanceOf', () => {

  test('filters to instance', () => {
    const subject = new Subject<Base>()

    const onNext = jest.fn()

    subject.pipe(filterIfInstanceOf(B)).subscribe(onNext)

    subject.next(new A())
    expect(onNext).not.toHaveBeenCalled()
    subject.next(new B())
    expect(onNext).toHaveBeenCalledTimes(1)
    expect(onNext.mock.calls[0][0]).toBeInstanceOf(B)
  })
  test('restricts types', () => {
    of<Base>(new A())
      .pipe(
        filterIfInstanceOf(B),
        tap((b) => b.b.toUpperCase())
      )
    expect.anything()
  })

})
