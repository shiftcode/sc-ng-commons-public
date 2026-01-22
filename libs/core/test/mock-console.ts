import { Mock,vi } from 'vitest'

const originalConsole = { ...console }

export interface ConsoleMock {
  debug: Mock
  info: Mock
  warn: Mock
  error: Mock
  log?: Mock
}

export function mockConsole() {
  console.log = vi.fn()
  console.debug = vi.fn()
  console.info = vi.fn()
  console.warn = vi.fn()
  console.error = vi.fn()

  return <ConsoleMock>(<any>console)
}

export function restoreConsole() {
  console = originalConsole
}
