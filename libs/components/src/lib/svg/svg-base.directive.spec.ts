import { HttpErrorResponse } from '@angular/common/http'
import { Component, inject, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Logger } from '@shiftcode/logger'
import { describe, expect, test, vi } from 'vitest'

import { SvgBaseDirective } from './svg-base.directive'
import { SvgRegistry } from './svg-registry.service'

const MOCK_SVG_URL = '/assets/test.svg'

@Component({ selector: 'sc-test-svg-base', template: '', standalone: true })
class TestSvgComponent extends SvgBaseDirective {
  readonly data = signal<{ url: string; attrs?: Record<string, string> }>({ url: MOCK_SVG_URL })
  protected readonly logger = inject(Logger)
}

function createSvgElement(): SVGElement {
  const div = document.createElement('div')
  div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" data-ts="${Date.now()}"><path d="M0 0"/></svg>`
  return div.querySelector('svg') as SVGElement
}

function setup() {
  const mockLogger = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  } as unknown as Logger

  const mockRegistry = { getFromUrl: vi.fn<() => Promise<SVGElement>>() }

  TestBed.configureTestingModule({
    providers: [
      { provide: Logger, useValue: mockLogger },
      { provide: SvgRegistry, useValue: mockRegistry },
    ],
  })

  return { mockLogger, mockRegistry }
}

async function flushMicrotasks(count = 2): Promise<void> {
  for (let i = 0; i < count; i++) {
    await Promise.resolve()
  }
}

async function renderComponent(url: string = MOCK_SVG_URL, attrs?: Record<string, string>) {
  const fixture = TestBed.createComponent(TestSvgComponent)

  fixture.componentInstance.data.set({ url, attrs })
  TestBed.tick()
  await flushMicrotasks()

  return {
    fixture,
    hostElement: fixture.nativeElement as HTMLElement,
  }
}

describe('SvgBaseDirective', () => {
  test('fetches SVG from the registry and inserts it into the DOM', async () => {
    const { mockRegistry } = setup()
    const svg = createSvgElement()
    mockRegistry.getFromUrl.mockResolvedValue(svg)

    const { hostElement } = await renderComponent()

    expect(mockRegistry.getFromUrl).toHaveBeenCalledWith(MOCK_SVG_URL)
    expect(hostElement.contains(svg)).toBe(true)
  })

  test('applies provided attrs to the SVG element', async () => {
    const { mockRegistry } = setup()
    const svg = createSvgElement()
    mockRegistry.getFromUrl.mockResolvedValue(svg)

    const { hostElement } = await renderComponent(MOCK_SVG_URL, { 'data-test': 'true', class: 'my-icon' })

    expect(svg.getAttribute('data-test')).toBe('true')
    expect(svg.getAttribute('class')).toBe('my-icon')
    expect(hostElement.contains(svg)).toBe(true)
  })

  test('does not modify SVG attributes when no attrs are provided', async () => {
    const { mockRegistry } = setup()
    const svg = createSvgElement()
    const originalAttributes = Array.from(svg.attributes).map((a) => ({ name: a.name, value: a.value }))
    mockRegistry.getFromUrl.mockResolvedValue(svg)

    const { hostElement } = await renderComponent()

    expect(Array.from(svg.attributes).map((a) => ({ name: a.name, value: a.value }))).toEqual(originalAttributes)
    expect(hostElement.contains(svg)).toBe(true)
  })

  test('allows to update the SVG when the url signal changes', async () => {
    const { mockRegistry } = setup()
    const svgFirst = createSvgElement()
    const svgSecond = createSvgElement()

    mockRegistry.getFromUrl.mockResolvedValueOnce(svgFirst).mockResolvedValueOnce(svgSecond)

    const { fixture, hostElement } = await renderComponent()

    expect(hostElement.contains(svgFirst)).toBe(true)

    fixture.componentInstance.data.set({ url: '/assets/other.svg' })
    TestBed.tick()
    await flushMicrotasks()

    expect(hostElement.contains(svgSecond)).toBe(true)
  })

  test('clears existing DOM content before inserting the new SVG on signal change', async () => {
    const { mockRegistry } = setup()
    const svgFirst = createSvgElement()
    const svgSecond = createSvgElement()
    mockRegistry.getFromUrl.mockResolvedValueOnce(svgFirst).mockResolvedValueOnce(svgSecond)

    const { fixture, hostElement } = await renderComponent()

    expect(hostElement.contains(svgFirst)).toBe(true)

    fixture.componentInstance.data.set({ url: '/assets/other.svg' })
    TestBed.tick()
    await flushMicrotasks()

    expect(hostElement.contains(svgFirst)).toBe(false)
    expect(hostElement.contains(svgSecond)).toBe(true)
    expect(hostElement.querySelectorAll('svg').length).toBe(1)
  })

  test('does not insert SVG when the signal changes before the first request resolved', async () => {
    const { mockRegistry } = setup()

    let resolveFirst!: (svg: SVGElement) => void
    const firstPromise = new Promise<SVGElement>((resolve) => (resolveFirst = resolve))

    const firstSvg = createSvgElement()
    const secondSvg = createSvgElement()

    mockRegistry.getFromUrl
      .mockReturnValueOnce(firstPromise) // first call returns a promise that we can control
      .mockResolvedValueOnce(secondSvg) // second call resolves immediately

    const { fixture, hostElement } = await renderComponent()

    expect(mockRegistry.getFromUrl).toHaveBeenCalledTimes(1)

    // Change signal before firstPromise resolves
    fixture.componentInstance.data.set({ url: '/assets/other.svg' })
    TestBed.tick()
    await flushMicrotasks()

    // At this point, the second svg should be rendered.
    expect(mockRegistry.getFromUrl).toHaveBeenCalledTimes(2)
    expect(hostElement.contains(secondSvg)).toBe(true)

    // Now resolve the first promise; it should have no effect in the DOM anymore.
    resolveFirst(firstSvg)
    TestBed.tick()
    await flushMicrotasks()
    expect(hostElement.contains(secondSvg)).toBe(true)
  })

  test('logs a debug info for network errors (HttpErrorResponse with status 0)', async () => {
    const { mockLogger, mockRegistry } = setup()

    const networkError = new HttpErrorResponse({ status: 0, url: MOCK_SVG_URL })
    mockRegistry.getFromUrl.mockRejectedValue(networkError)

    await renderComponent()

    expect(mockLogger.debug).toHaveBeenCalledWith(expect.stringContaining(MOCK_SVG_URL), networkError)
    expect(mockLogger.error).not.toHaveBeenCalled()
  })

  test('logs an error for HttpErrorResponse with a non-zero status', async () => {
    const { mockLogger, mockRegistry } = setup()

    const notFoundErrorResponse = new HttpErrorResponse({ status: 404, url: MOCK_SVG_URL })
    mockRegistry.getFromUrl.mockRejectedValue(notFoundErrorResponse)

    await renderComponent()

    expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(MOCK_SVG_URL), notFoundErrorResponse)
  })

  test('logs an error for non-HTTP errors', async () => {
    const { mockLogger, mockRegistry } = setup()

    const genericError = new Error('Something went wrong')
    mockRegistry.getFromUrl.mockRejectedValue(genericError)

    await renderComponent()

    expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(MOCK_SVG_URL), genericError)
  })
})
