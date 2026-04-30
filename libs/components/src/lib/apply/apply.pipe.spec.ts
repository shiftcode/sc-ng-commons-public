import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { describe, expect, it, vi } from 'vitest'

import { ApplyPipe } from './apply.pipe'

describe('ApplyPipe', () => {
  it('calls the provided function with the provided value', () => {
    const pipe = new ApplyPipe()

    const input = 'hello'
    const toUpperCaseFn = vi.fn((arg: string) => arg.toUpperCase())

    pipe.transform(input, toUpperCaseFn)
    expect(toUpperCaseFn).toHaveBeenCalledWith(input)
  })

  it('should return the result of the function call', () => {
    const pipe = new ApplyPipe()

    const input = 42
    const doubleFn = (arg: number) => arg * 2
    const expected = 84

    const result = pipe.transform(input, doubleFn)
    expect(result).toEqual(expected)
  })

  it('works integrated', () => {
    const squareFn = vi.fn((value: number) => value * value)
    const doubleFn = vi.fn((value: number) => 2 * value)

    @Component({
      selector: 'sc-test-component',
      template: '{{prefix()}}{{ value() | apply: fn() }}',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [ApplyPipe],
    })
    class TestComponent {
      readonly prefix = signal('Value: ')
      readonly value = signal(4)
      readonly fn = signal(doubleFn)
    }

    const fixture = TestBed.createComponent(TestComponent)
    TestBed.tick()
    const component = fixture.componentInstance
    const el = fixture.nativeElement as HTMLElement

    expect(el.innerHTML).toBe('Value: 8')

    // new fn and new value
    component.value.set(5)
    component.fn.set(squareFn)
    TestBed.tick()
    expect(el.innerHTML).toBe('Value: 25')

    // rerender with the same value
    component.prefix.set('Hello: ')
    TestBed.tick()
    expect(el.innerHTML).toBe('Hello: 25')
    // should have been called once only since pure
    expect(squareFn).toHaveBeenCalledTimes(1)
  })
})
