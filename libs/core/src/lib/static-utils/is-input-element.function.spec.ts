import { DOCUMENT } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { beforeEach,describe, expect, it } from 'vitest'

import { isInputElement } from './is-input-element.function'

describe('isInputElement', () => {
  let doc: Document
  beforeEach(() => {
    doc = TestBed.inject(DOCUMENT)
  })
  it('returns true when input element', () => {
    const el = doc.createElement('input')
    expect(isInputElement(el)).toBe(true)
  })
  it('returns false when div element', () => {
    const el = doc.createElement('div')
    expect(isInputElement(el)).toBe(false)
  })
})
