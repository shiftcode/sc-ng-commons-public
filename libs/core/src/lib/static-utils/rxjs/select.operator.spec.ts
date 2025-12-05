import { of, Subject, tap } from 'rxjs'

import { select } from './select.operator'

interface MyObject {
  a: string
}

describe('select operator', () => {
  test('maps the to the provided property value', () => {
    const subject = new Subject<MyObject>()

    const onNext = jest.fn()
    subject.pipe(select('a')).subscribe(onNext)

    subject.next({ a: 'ok' })
    expect(onNext).toHaveBeenCalledWith('ok')
    subject.next({ a: 'value' })
    expect(onNext).toHaveBeenCalledWith('value')
    subject.complete()
  })

  test('restricts types', () => {
    of({ val: 'ok' }).pipe(
      select('val'),
      tap((val) => val.toUpperCase()),
    )
    expect.anything()
  })
})
