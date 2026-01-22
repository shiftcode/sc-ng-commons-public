import { of, Subject, tap } from 'rxjs'
import { describe, expect, it, vi } from 'vitest'

import { filterIfInstanceOf } from './filter-if-instance-of.operator'

abstract class Base {
  abstract type: 'A' | 'B'
}

class A extends Base {
  type: 'A'

  get a() {
    return this.type
  }
}

class B extends Base {
  type: 'B'

  get b() {
    return this.type
  }
}

describe('filterIfInstanceOf', () => {
  it('filters to instance', () => {
    const subject = new Subject<Base>()

    const onNext = vi.fn()

    subject.pipe(filterIfInstanceOf(B)).subscribe(onNext)

    subject.next(new A())
    expect(onNext).not.toHaveBeenCalled()
    subject.next(new B())
    expect(onNext).toHaveBeenCalledTimes(1)
    expect(onNext.mock.calls[0][0]).toBeInstanceOf(B)
  })
  it('restricts types', () => {
    of<Base>(new A()).pipe(
      filterIfInstanceOf(B),
      tap((b) => b.b.toUpperCase()),
    )
    expect.anything()
  })
})
