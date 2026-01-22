import { Subject } from 'rxjs'
import { describe, expect, it, vi } from 'vitest'

import { tapPrevious } from './tap-previous.operator'

describe('tapPrevious operator', () => {
  it('executes given function on emit with the previous value', () => {
    const subject = new Subject<string>()

    const onTapPrevious = vi.fn()
    subject.pipe(tapPrevious(onTapPrevious)).subscribe()

    subject.next('a')
    expect(onTapPrevious).not.toHaveBeenCalled()
    subject.next('b')
    expect(onTapPrevious).toHaveBeenCalledTimes(1)
    expect(onTapPrevious).toHaveBeenCalledWith('a')
    subject.next('c')
    expect(onTapPrevious).toHaveBeenCalledWith('b')
    subject.complete()
    expect(onTapPrevious).toHaveBeenCalledTimes(2)
  })
})
