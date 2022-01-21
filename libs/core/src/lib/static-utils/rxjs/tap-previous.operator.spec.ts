import { Subject } from 'rxjs'
import { tapPrevious } from './tap-previous.operator'

describe('tapPrevious operator', () => {
  test('executes given function on emit with the previous value', () => {

    const subject = new Subject<string>()

    const onTapPrevious = jest.fn()
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
