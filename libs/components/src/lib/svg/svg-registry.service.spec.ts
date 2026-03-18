import { provideHttpClient } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { DOCUMENT } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { beforeEach, describe, expect, test } from 'vitest'

import { SvgRegistry } from './svg-registry.service'

const MOCK_SVG = '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="5"/></svg>'
const MOCK_SVG_URL = '/assets/icon.svg'

describe('SvgRegistry', () => {
  let service: SvgRegistry
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    service = TestBed.inject(SvgRegistry)
    httpMock = TestBed.inject(HttpTestingController)
  })

  describe('createSvgElementFromString', () => {
    test('creates an SVGElement with default attributes', () => {
      const doc = TestBed.inject(DOCUMENT)
      const svg = SvgRegistry.createSvgElementFromString(MOCK_SVG, doc)

      expect(svg).toBeInstanceOf(SVGElement)
      expect(svg.getAttribute('fit')).toBe('')
      expect(svg.getAttribute('height')).toBe('100%')
      expect(svg.getAttribute('width')).toBe('100%')
      expect(svg.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet')
      expect(svg.getAttribute('focusable')).toBe('false')
    })

    test('removes style tags from svg', () => {
      const doc = TestBed.inject(DOCUMENT)
      const svgWithStyle = '<svg><style>.cls { fill: red; }</style><circle cx="10" cy="10" r="5"/></svg>'
      const svg = SvgRegistry.createSvgElementFromString(svgWithStyle, doc)

      expect(svg.querySelectorAll('style').length).toBe(0)
      expect(svg.querySelector('circle')).toBeTruthy()
    })

    test('throws when no svg element found', () => {
      const doc = TestBed.inject(DOCUMENT)
      expect(() => SvgRegistry.createSvgElementFromString('<div>not svg</div>', doc)).toThrow('Could not find svg')
    })
  })

  describe('getFromUrl', () => {
    test('fetches svg from url and returns an SVGElement', async () => {
      const promise = service.getFromUrl(MOCK_SVG_URL)
      httpMock.expectOne(MOCK_SVG_URL).flush(MOCK_SVG)

      const svg = await promise
      expect(svg).toBeInstanceOf(SVGElement)
      expect(svg.getAttribute('height')).toBe('100%')
      httpMock.verify()
    })

    test('caches the request and returns a clone on subsequent calls', async () => {
      const promise1 = service.getFromUrl(MOCK_SVG_URL)
      const promise2 = service.getFromUrl(MOCK_SVG_URL)
      httpMock.expectOne(MOCK_SVG_URL).flush(MOCK_SVG)

      const [svg1, svg2] = await Promise.all([promise1, promise2])
      expect(svg1).not.toBe(svg2)
      expect(svg1.outerHTML).toBe(svg2.outerHTML)
      httpMock.verify()
    })
  })
})
