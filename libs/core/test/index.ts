import { type MockInstance, test as testBase } from 'vitest'

import { consoleErrorSpyFixture } from './console-error-fixture'

export * from './mock-storage'

export const test = testBase.extend<{ consoleErrorSpy: MockInstance<typeof console.error> }>({
  consoleErrorSpy: consoleErrorSpyFixture,
})
