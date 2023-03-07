import { Request } from 'express'
import { TestBed } from '@angular/core/testing'
import { PLATFORM_ID } from '@angular/core'
import { REQUEST } from '@nguniversal/express-engine/tokens'
import { provideOrigin } from './provide-origin.function'
import { ORIGIN } from '@shiftcode/ngx-core'

const PLATFORM_SERVER = 'server'
const PLATFORM_BROWSER = 'browser'

const targetDomain = 'target.io'

describe('provideOrigin', () => {

  describe('when platform browser', () => {
    test('throws', () => {
      TestBed.configureTestingModule({
        providers: [{ provide: PLATFORM_ID, useValue: PLATFORM_BROWSER }, provideOrigin()]
      })
      expect(() => TestBed.inject(ORIGIN)).toThrow(Error)
    })
  })

  describe('when platform server nonAws', () => {
    test('throws when no request provided', () => {
      TestBed.configureTestingModule({
        providers: [{ provide: PLATFORM_ID, useValue: PLATFORM_SERVER }, provideOrigin()]
      })
      expect(() => TestBed.inject(ORIGIN)).toThrow(Error)
    })
  })

  describe('when aws execution env', () => {
    beforeEach(() => {
      process.env['AWS_EXECUTION_ENV'] = 'true'
      TestBed.configureTestingModule({
        providers: [
          { provide: PLATFORM_ID, useValue: PLATFORM_SERVER },
          provideOrigin()
        ],
      })
    })
    afterEach(() => {
      delete process.env['FINAL_DOMAIN']
    })
    afterAll(() => {
      delete process.env['AWS_EXECUTION_ENV']
    })

    test('throws when no env var not set', () => {
      expect(() => TestBed.inject(ORIGIN)).toThrow(Error)
    })

    test('returns from env FINAL_DOMAIN', () => {
      process.env['FINAL_DOMAIN'] = targetDomain
      expect(TestBed.inject(ORIGIN)).toBe(`https://${targetDomain}`)
    })

  })

  describe('when not aws execution env', () => {
    const req: Request = <any>{
      hostname: targetDomain,
      protocol: 'https',
    }
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: PLATFORM_ID, useValue: PLATFORM_SERVER },
          { provide: REQUEST, useValue: req },
          provideOrigin()
        ],
      })
    })
    test('returns origin combined from request with port 4000', () => {
      expect(TestBed.inject(ORIGIN)).toBe(`${req.protocol}://${req.hostname}:4000`)
    })

  })

})
