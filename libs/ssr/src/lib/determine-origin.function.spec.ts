import { Request } from 'express'
import { determineOrigin } from './determine-origin.function'

const PLATFORM_SERVER = 'server'
const PLATFORM_BROWSER = 'browser'

const targetDomain = 'target.io'

describe('determineOrigin', () => {

  describe('when platform browser', () => {
    test('throws', () => {
      expect(() => determineOrigin(PLATFORM_BROWSER)).toThrow(Error)
    })
  })

  describe('when platform server', () => {
    test('throws when no request provided', () => {
      expect(() => determineOrigin(PLATFORM_SERVER)).toThrow(Error)
    })
  })

  describe('when aws execution env', () => {
    beforeEach(() => { process.env['AWS_EXECUTION_ENV'] = 'true' })
    afterEach(() => { delete process.env['FINAL_DOMAIN'] })
    afterAll(() => { delete process.env['AWS_EXECUTION_ENV'] })

    test('throws when no FINAL_DOMAIN not set', () => {
      expect(() => determineOrigin(PLATFORM_SERVER, <any>{})).toThrow(Error)
    })

    test('returns from env FINAL_DOMAIN', () => {
      process.env['FINAL_DOMAIN'] = targetDomain
      expect(determineOrigin(PLATFORM_SERVER, <any>{})).toBe(`https://${targetDomain}`)
    })

  })

  describe('when not aws execution env', () => {

    test('returns origin combined from request with port 4000', () => {
      const req: Request = <any>{
        hostname: targetDomain,
        protocol: 'https',
      }
      expect(determineOrigin(PLATFORM_SERVER, req)).toBe(`${req.protocol}://${req.hostname}:4000`)
    })

  })

})
