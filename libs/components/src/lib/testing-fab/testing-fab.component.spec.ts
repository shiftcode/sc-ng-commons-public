import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DefaultUrlSerializer, NavigationEnd, Router } from '@angular/router'
import { LocalStorage } from '@shiftcode/ngx-core'
import { Subject } from 'rxjs'
import { describe, expect, test, vi } from 'vitest'

import { TestingFabComponent } from './testing-fab.component'
import { TESTING_FAB_WIDGETS } from './testing-fab-config.token'
import type { TestingFabWidget } from './testing-fab-widget.type'

@Component({
  selector: 'sc-test-custom-widget',
  template: `<div data-test-id="custom-widget">custom</div>`,
  standalone: true,
})
class TestCustomWidgetComponent {}

const serializer = new DefaultUrlSerializer()
function queryRequired<TElement extends Element>(
  fixture: ComponentFixture<TestingFabComponent>,
  selector: string,
): TElement {
  const element = (fixture.nativeElement as HTMLElement).querySelector<TElement>(selector)
  if (!element) {
    throw new Error(`Expected element for selector "${selector}"`)
  }

  return element
}

function setup(widgets: readonly TestingFabWidget[], url = '/', localStorageValue: unknown = null) {
  const routerEvents = new Subject<NavigationEnd>()
  const routerMock = {
    events: routerEvents.asObservable(),
    url,
    parseUrl: vi.fn<typeof serializer.parse>((value) => serializer.parse(value)),
    navigate: vi.fn().mockResolvedValue(true),
  } as unknown as Router
  const localStorageMock = {
    persistent: true,
    observe: vi.fn(),
    setItem: vi.fn(),
    getItem: vi.fn().mockReturnValue(localStorageValue),
    delete: vi.fn(),
    clear: vi.fn(),
    keys: vi.fn().mockReturnValue([]),
  } as unknown as LocalStorage

  TestBed.configureTestingModule({
    imports: [TestingFabComponent],
    providers: [
      { provide: TESTING_FAB_WIDGETS, useValue: widgets },
      { provide: Router, useValue: routerMock },
      { provide: LocalStorage, useValue: localStorageMock },
    ],
  })

  const fixture = TestBed.createComponent(TestingFabComponent)
  TestBed.tick()

  return { fixture, routerMock, routerEvents, localStorageMock }
}

describe('TestingFabComponent', () => {
  test('renders select widget and uses URL query parameter as selected value', () => {
    const widgets: readonly TestingFabWidget[] = [
      {
        id: 'env',
        label: 'Backend Environment',
        type: 'select-query-param',
        queryParam: 'env',
        options: [
          { label: 'QA', value: 'qa' },
          { label: 'Prod', value: 'prod' },
        ],
      },
    ]

    const { fixture, routerEvents } = setup(widgets, '/?env=qa')
    routerEvents.next(new NavigationEnd(1, '/?env=qa', '/?env=qa'))
    fixture.detectChanges()
    const select = queryRequired<HTMLSelectElement>(fixture, 'select')
    expect(select.value).toBe('qa')
  })

  test('updates query parameters when select widget value changes', () => {
    const widgets: readonly TestingFabWidget[] = [
      {
        id: 'env',
        label: 'Backend Environment',
        type: 'select-query-param',
        queryParam: 'env',
        options: [
          { label: 'QA', value: 'qa' },
          { label: 'Prod', value: 'prod' },
        ],
      },
    ]

    const { fixture, routerMock } = setup(widgets, '/?env=qa')
    const select = queryRequired<HTMLSelectElement>(fixture, 'select')
    select.value = 'prod'
    select.dispatchEvent(new Event('change'))

    expect(routerMock.navigate).toHaveBeenCalledWith([], {
      queryParams: { env: 'prod' },
      queryParamsHandling: 'merge',
    })

    select.value = ''
    select.dispatchEvent(new Event('change'))

    expect(routerMock.navigate).toHaveBeenNthCalledWith(2, [], {
      queryParams: { env: null },
      queryParamsHandling: 'merge',
    })
  })

  test('forces hard reload when configured on select widget', () => {
    const widgets: readonly TestingFabWidget[] = [
      {
        id: 'env',
        label: 'Backend Environment',
        type: 'select-query-param',
        queryParam: 'env',
        hardReload: true,
        options: [
          { label: 'QA', value: 'qa' },
          { label: 'Prod', value: 'prod' },
        ],
      },
    ]

    const { fixture, routerMock } = setup(widgets, '/?env=qa')
    const select = queryRequired<HTMLSelectElement>(fixture, 'select')
    select.value = 'prod'
    expect(() => select.dispatchEvent(new Event('change'))).not.toThrow()

    expect(routerMock.navigate).not.toHaveBeenCalled()
  })

  test('renders a custom component widget', () => {
    const widgets: readonly TestingFabWidget[] = [
      {
        id: 'custom',
        label: 'Custom Widget',
        type: 'custom-component',
        component: TestCustomWidgetComponent,
      },
    ]

    const { fixture } = setup(widgets)
    const customWidget = queryRequired<HTMLElement>(fixture, '[data-test-id="custom-widget"]')
    expect(customWidget).not.toBeNull()
  })

  test('runs action widgets when clicked', () => {
    const action = vi.fn()
    const widgets: readonly TestingFabWidget[] = [
      {
        id: 'toggle-i18n',
        label: 'Show i18n Keys',
        type: 'action',
        action,
      },
    ]

    const { fixture } = setup(widgets)
    const button = queryRequired<HTMLButtonElement>(fixture, '.sc-testing-fab__action')
    button.click()

    expect(action).toHaveBeenCalledTimes(1)
  })

  test('loads saved FAB position from local storage', () => {
    const { fixture } = setup([], '/', 'top-left')
    const host = fixture.nativeElement as HTMLElement
    expect(host.classList.contains('sc-testing-fab--top-left')).toBe(true)
  })

  test('stores and applies dropped position when dragging to another corner', () => {
    const { fixture, localStorageMock } = setup([])
    const button = queryRequired<HTMLButtonElement>(fixture, '.sc-testing-fab__trigger')
    const createPointerEvent = (type: string, x: number, y: number) =>
      new (globalThis.PointerEvent ?? MouseEvent)(type, {
        bubbles: true,
        button: 0,
        clientX: x,
        clientY: y,
      })

    button.dispatchEvent(createPointerEvent('pointerdown', window.innerWidth - 20, window.innerHeight - 20))
    button.dispatchEvent(createPointerEvent('pointermove', 20, 20))
    button.dispatchEvent(createPointerEvent('pointerup', 20, 20))
    fixture.detectChanges()

    const host = fixture.nativeElement as HTMLElement
    expect(host.classList.contains('sc-testing-fab--top-left')).toBe(true)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('sc-testing-fab.position', 'top-left')
  })
})
