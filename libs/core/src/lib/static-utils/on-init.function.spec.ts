import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { describe, expect, it, vi } from 'vitest'

import { onInit } from './on-init.function'

describe('onInit', () => {
  it('throws when used outside an injection context', () => {
    const initFn = vi.fn()

    expect(() => onInit(initFn)).toThrow()
  })

  it('does not call initFn before effects are flushed', () => {
    const initFn = vi.fn()

    TestBed.runInInjectionContext(() => onInit(initFn))

    expect(initFn).not.toHaveBeenCalled()
  })

  it('calls initFn exactly once when effects are flushed', () => {
    const initFn = vi.fn()

    TestBed.runInInjectionContext(() => onInit(initFn))
    TestBed.tick()

    expect(initFn).toHaveBeenCalledTimes(1)
  })

  it('does not call initFn again on subsequent flushes even when reading changed signals (runs only once)', () => {
    const foo = signal('foo')
    const initFn = vi.fn(() => {
      foo()
    })

    TestBed.runInInjectionContext(() => onInit(initFn))
    TestBed.tick()
    foo.set('bar')
    TestBed.tick()

    expect(initFn).toHaveBeenCalledTimes(1)
  })

  it('registers and calls the cleanup function when the injector is destroyed', () => {
    const cleanup = vi.fn()
    const initFn = vi.fn().mockReturnValue(cleanup)

    TestBed.runInInjectionContext(() => onInit(initFn))
    TestBed.tick()

    expect(cleanup).not.toHaveBeenCalled()

    TestBed.resetTestingModule()

    expect(cleanup).toHaveBeenCalledTimes(1)
  })

  it('does not register a cleanup when initFn returns a non-function value', () => {
    // returning a truthy non-function should not cause errors
    const initFn = vi.fn().mockReturnValue(42 as unknown as void)

    TestBed.runInInjectionContext(() => onInit(initFn))

    expect(() => TestBed.tick()).not.toThrow()
    expect(() => TestBed.resetTestingModule()).not.toThrow()
  })

  it('works integrated on a Component', () => {
    const cleanUpFn = vi.fn(() => void 0)

    const initFn = vi.fn().mockReturnValue(cleanUpFn)

    @Component({ template: '' })
    class TestComponent {
      constructor() {
        onInit(initFn)
      }
    }

    const fix = TestBed.createComponent(TestComponent)
    TestBed.tick()
    expect(initFn).toHaveBeenCalledTimes(1)
    expect(cleanUpFn).not.toHaveBeenCalled()

    fix.destroy()
    expect(cleanUpFn).toHaveBeenCalledTimes(1)
  })
})
