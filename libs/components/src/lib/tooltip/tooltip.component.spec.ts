import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { afterEach, beforeEach, describe, expect, onTestFinished, test, vi } from 'vitest'

import { TooltipComponent } from './tooltip.component'
import { TooltipDirective } from './tooltip.directive'

describe('TooltipComponent CSS transitions', () => {
  let fixture: ComponentFixture<TooltipComponent>
  let component: TooltipComponent
  let tooltip: HTMLElement
  let computedStyle: CSSStyleDeclaration

  function dispatchTransition(
    type: 'transitionstart' | 'transitionend' | 'transitioncancel',
    propertyName = 'opacity',
    target = tooltip,
    pseudoElement = '',
  ): void {
    const event = new Event(type, { bubbles: true })
    Object.defineProperties(event, {
      propertyName: { value: propertyName },
      pseudoElement: { value: pseudoElement },
    })
    target.dispatchEvent(event)
  }

  function advanceTime(delay = 0): void {
    vi.advanceTimersByTime(delay)
    fixture.detectChanges()
    TestBed.tick()
  }

  beforeEach(() => {
    vi.useFakeTimers()
    TestBed.configureTestingModule({ imports: [TooltipComponent] })
    fixture = TestBed.createComponent(TooltipComponent)
    component = fixture.componentInstance
    component.message = 'Tooltip message'
    fixture.detectChanges()
    const element = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('.sc-tooltip')
    if (!element) {
      throw new Error('Expected tooltip element')
    }
    tooltip = element
    // JSDOM does not interpolate CSS transitions.
    computedStyle = document.createElement('div').style
    computedStyle.opacity = '1'
    vi.spyOn(window, 'getComputedStyle').mockReturnValue(computedStyle)
  })

  afterEach(() => {
    fixture.destroy()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  test('applies visibility classes after the configured delays', () => {
    expect(tooltip.classList.contains('sc-tooltip--visible')).toBe(false)
    expect(tooltip.classList.contains('sc-tooltip--hidden')).toBe(false)

    component.show(50)
    advanceTime(49)
    expect(component.visibility).toBe('initial')
    advanceTime(1)
    expect(tooltip.classList.contains('sc-tooltip--visible')).toBe(true)

    component.hide(50)
    advanceTime(49)
    expect(component.isVisible()).toBe(true)
    advanceTime(1)
    expect(tooltip.classList.contains('sc-tooltip--visible')).toBe(false)
    expect(tooltip.classList.contains('sc-tooltip--hidden')).toBe(true)
  })

  test('notifies after the opacity hide transition completes', () => {
    const onHidden = vi.fn()
    component.afterHidden().subscribe(onHidden)
    component.show(0)
    advanceTime()
    dispatchTransition('transitionend')
    expect(onHidden).not.toHaveBeenCalled()

    component.hide(0)
    advanceTime()
    expect(onHidden).not.toHaveBeenCalled()
    dispatchTransition('transitionend')
    expect(onHidden).toHaveBeenCalledTimes(1)
  })

  test('ignores other properties, descendants and pseudo-elements', () => {
    const onHidden = vi.fn()
    component.afterHidden().subscribe(onHidden)
    component.show(0)
    advanceTime()
    component.hide(0)
    advanceTime()

    dispatchTransition('transitionend', 'scale')
    dispatchTransition('transitionend', 'opacity', tooltip, '::before')
    const label = tooltip.querySelector<HTMLElement>('.sc-tooltip__label')
    if (!label) {
      throw new Error('Expected tooltip label')
    }
    dispatchTransition('transitionend', 'opacity', label)
    expect(onHidden).not.toHaveBeenCalled()

    dispatchTransition('transitionend')
    expect(onHidden).toHaveBeenCalledTimes(1)
  })

  test('does not detach on cancellation or after showing again', () => {
    const onHidden = vi.fn()
    component.afterHidden().subscribe(onHidden)
    component.show(0)
    advanceTime()
    component.hide(0)
    advanceTime()
    dispatchTransition('transitioncancel')
    expect(onHidden).not.toHaveBeenCalled()

    component.show(0)
    advanceTime()
    dispatchTransition('transitionend')
    expect(onHidden).not.toHaveBeenCalled()
    expect(component.isVisible()).toBe(true)
  })

  test('suppresses body interactions during transitions and restores them on completion', () => {
    component.show(0)
    advanceTime()
    dispatchTransition('transitionstart')
    document.body.click()
    advanceTime()
    expect(component.isVisible()).toBe(true)

    dispatchTransition('transitionend')
    document.body.click()
    advanceTime()
    expect(component.visibility).toBe('hidden')
  })

  test('detaches without a transition when hidden before its delayed show', () => {
    const onHidden = vi.fn()
    component.afterHidden().subscribe(onHidden)
    component.show(100)
    component.hide(0)
    advanceTime()
    expect(onHidden).toHaveBeenCalledTimes(1)
    expect(component.visibility).toBe('hidden')
    advanceTime(100)
    expect(component.isVisible()).toBe(false)
  })

  test('detaches when hiding a tooltip with no opacity transition', () => {
    const onHidden = vi.fn()
    component.afterHidden().subscribe(onHidden)
    component.show(0)
    advanceTime()
    computedStyle.opacity = '0'
    component.hide(0)
    advanceTime()
    expect(onHidden).toHaveBeenCalledTimes(1)
  })

  test('notifies only once when hidden repeatedly', () => {
    const onHidden = vi.fn()
    component.afterHidden().subscribe(onHidden)
    component.show(0)
    advanceTime()
    computedStyle.opacity = '0'
    component.hide(0)
    advanceTime()
    component.hide(0)
    advanceTime()
    expect(onHidden).toHaveBeenCalledTimes(1)
  })

  test('cancels a delayed hide when shown again', () => {
    component.show(0)
    advanceTime()
    component.hide(100)
    component.show(0)
    advanceTime(100)
    expect(component.isVisible()).toBe(true)
  })

  test('clears pending timers and completes afterHidden on destruction', () => {
    const onComplete = vi.fn()
    component.afterHidden().subscribe({ complete: onComplete })
    component.show(100)
    fixture.destroy()
    vi.advanceTimersByTime(100)
    expect(component.visibility).toBe('initial')
    expect(onComplete).toHaveBeenCalledTimes(1)
  })
})

@Component({
  selector: 'sc-test-host',
  template: `<button type="button" scTooltip="Tooltip message">Trigger</button>`,
  imports: [TooltipDirective],
})
class HostComponent {}

test('TooltipDirective hides the tooltip when the trigger is clicked', () => {
  vi.useFakeTimers()
  onTestFinished(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })
  vi.spyOn(window, 'getComputedStyle').mockReturnValue({ opacity: '1' } as CSSStyleDeclaration)
  const fixture = TestBed.createComponent(HostComponent)
  fixture.detectChanges()
  const trigger = (fixture.nativeElement as HTMLElement).querySelector('button')!

  trigger.dispatchEvent(new MouseEvent('mouseenter'))
  vi.runAllTimers()
  fixture.detectChanges()
  expect(document.querySelector('.sc-tooltip--visible')).not.toBeNull()

  // clicking the trigger fires a mouseleave followed by a click
  trigger.dispatchEvent(new MouseEvent('mouseleave'))
  trigger.click()
  vi.advanceTimersByTime(0)
  fixture.detectChanges()
  const transitionEnd = Object.assign(new Event('transitionend'), { propertyName: 'opacity', pseudoElement: '' })
  document.querySelector('.sc-tooltip--hidden')!.dispatchEvent(transitionEnd)
  expect(document.querySelector('.sc-tooltip')).toBeNull()

  // the hide delay scheduled by mouseleave elapses
  expect(() => vi.runAllTimers()).not.toThrow()
})

test('TooltipDirective detaches the tooltip when the trigger is clicked before it is visible', () => {
  vi.useFakeTimers()
  onTestFinished(() => {
    vi.useRealTimers()
  })
  const fixture = TestBed.createComponent(HostComponent)
  fixture.detectChanges()
  const trigger = (fixture.nativeElement as HTMLElement).querySelector('button')!

  trigger.dispatchEvent(new MouseEvent('mouseenter'))
  trigger.dispatchEvent(new MouseEvent('mouseleave'))
  trigger.click()
  expect(() => vi.runAllTimers()).not.toThrow()
  expect(document.querySelector('.sc-tooltip')).toBeNull()
})
