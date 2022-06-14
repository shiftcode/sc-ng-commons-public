import { DOCUMENT } from '@angular/common'
import { TestBed } from '@angular/core/testing'
import { isInputElement } from './is-input-element.function'

describe('isInputElement', () => {
  let doc: Document
  beforeEach(() => {
    doc = TestBed.inject(DOCUMENT)
  })
  test('returns true when input element', () => {
    const el = doc.createElement('input')
    expect(isInputElement(el)).toBe(true)
  })
  test('returns false when div element', () => {
    const el = doc.createElement('div')
    expect(isInputElement(el)).toBe(false)
  })
})
