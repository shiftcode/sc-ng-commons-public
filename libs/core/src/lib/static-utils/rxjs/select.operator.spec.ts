import { of, Subject, tap } from 'rxjs'
import { describe, expect, it, vi } from 'vitest'

import { select } from './select.operator'

interface MyObject {
  a: string
}

describe('select operator', () => {
  it('maps the to the provided property value', () => {
    const subject = new Subject<MyObject>()

    const onNext = vi.fn()
    subject.pipe(select('a')).subscribe(onNext)

    subject.next({ a: 'ok' })
    expect(onNext).toHaveBeenCalledWith('ok')
    subject.next({ a: 'value' })
    expect(onNext).toHaveBeenCalledWith('value')
    subject.complete()
  })

  it('restricts types', () => {
    of({ val: 'ok' }).pipe(
      select('val'),
      tap((val) => val.toUpperCase()),
    )
    expect.anything()
  })
})
