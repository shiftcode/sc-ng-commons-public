import { Subject } from 'rxjs'
import { describe, expect, it, vi } from 'vitest'

import { tapLast } from './tap-last.operator'

describe('tapLast operator', () => {
  it('does only execute right before observable completes', () => {
    const subject = new Subject<number>()

    let callCounter = 0

    const onNext = vi.fn(() => callCounter++)
    const onTapLast = vi.fn(() => callCounter++)
    const onComplete = vi.fn(() => callCounter++)

    subject.pipe(tapLast(onTapLast)).subscribe({ next: onNext, complete: onComplete })

    subject.next(1)
    subject.next(2)

    expect(onTapLast).not.toHaveBeenCalled()
    expect(onComplete).not.toHaveBeenCalled()
    expect(onNext).toHaveBeenCalledTimes(2)

    subject.complete()
    expect(onTapLast).toHaveBeenCalledWith(2)
    expect(onComplete).toHaveBeenCalled()

    // expect(onTapLast).toHaveBeenCalledBefore(onComplete)
    expect(onTapLast.mock.results[0].value).toBeLessThan(onComplete.mock.results[0].value)
  })
})
