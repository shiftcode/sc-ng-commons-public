import { Subject } from 'rxjs'
import { describe, expect, test, vi } from 'vitest'

import { setup } from './setup.operator'

describe('setup operator', () => {
  test('setup is called when someone subscribes', () => {
    const onSetup = vi.fn()
    const subject = new Subject<string>()
    const obs = subject.pipe(setup(onSetup))
    expect(onSetup).not.toHaveBeenCalled()
    obs.subscribe()
    expect(onSetup).toHaveBeenCalled()
    subject.next('a')
    subject.next('b')
    subject.complete()
    expect(onSetup).toHaveBeenCalledTimes(1)
  })
})
