import { PLATFORM_ID } from '@angular/core'
import { provideOriginFromEnv } from './provide-origin-from-env.function'
import { ORIGIN } from './origin.token'
import { TestBed } from '@angular/core/testing'

describe('provideOriginFromEnv', () => {
  const ENV_KEY = 'TEST_ORIGIN'

  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnv = { ...process.env }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  function setup(platformId: 'browser' | 'server') {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: platformId }, provideOriginFromEnv(ENV_KEY)],
    })
  }

  it('should provide the ORIGIN token with a valid origin from env', () => {
    setup('server')

    const validOrigin = 'https://example.valid.com'

    process.env[ENV_KEY] = validOrigin

    expect(TestBed.inject(ORIGIN)).toBe(validOrigin)
  })

  it('should throw if not running on the server', () => {
    setup('browser')

    process.env[ENV_KEY] = 'https://example.valid.com'

    expect(() => TestBed.inject(ORIGIN)).toThrowError(`provideOriginFromEnv can only be used on the server`)
  })

  it('should throw if env var is not defined', () => {
    setup('server')
    delete process.env[ENV_KEY]
    expect(() => TestBed.inject(ORIGIN)).toThrowError(`Env var ${ENV_KEY} needs to be defined`)
  })

  it('should throw if env var is not a valid origin', () => {
    setup('server')
    process.env[ENV_KEY] = 'invalid-origin'
    expect(() => TestBed.inject(ORIGIN)).toThrowError(`Env var ${ENV_KEY} is not a valid origin: invalid-origin`)
  })
})
