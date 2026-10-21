import { type MockInstance, vi } from 'vitest'

/**
 * mutes `console.error` for the test and provides the spy.
 * restored automatically after the test.
 */
// vitest requires destructuring of the fixture context
// eslint-disable-next-line no-empty-pattern
export async function consoleErrorSpyFixture({}, use: (spy: MockInstance<typeof console.error>) => Promise<void>) {
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
  await use(spy)
  spy.mockRestore()
}
