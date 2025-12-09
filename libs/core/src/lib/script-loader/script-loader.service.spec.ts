import { CommonModule } from '@angular/common'
import { DOCUMENT, PLATFORM_ID } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { LogLevel } from '@shiftcode/logger'

import { LoggerService } from '../logger/logger.service'
import { MockLoggerService } from '../logger/mock-logger.service'
import { ScriptLoaderService } from './script-loader.service'

export const PLATFORM_BROWSER_ID = 'browser'
export const PLATFORM_SERVER_ID = 'server'

describe('ScriptLoaderService', () => {
  let service: ScriptLoaderService
  let doc: Document

  describe('when on server', () => {
    let loggerService: MockLoggerService
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule],
        providers: [
          { provide: PLATFORM_ID, useValue: PLATFORM_SERVER_ID },
          { provide: LoggerService, useClass: MockLoggerService },
        ],
      })
      loggerService = <any>TestBed.inject(LoggerService)
    })
    test('warns when instantiated', () => {
      TestBed.inject(ScriptLoaderService)
      expect(loggerService.loggers.get('ScriptLoaderService')?.[0]?.statements[LogLevel.WARN].length).toBe(1)
    })
  })

  describe('when in browser', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule],
        providers: [
          { provide: PLATFORM_ID, useValue: PLATFORM_BROWSER_ID },
          { provide: LoggerService, useClass: MockLoggerService },
        ],
      })
      service = TestBed.inject(ScriptLoaderService)
      doc = TestBed.inject(DOCUMENT)
      doc.head.appendChild(doc.createElement('script'))
    })

    test('resolves when script onLoad was called', async () => {
      const scriptSrc = '/assets/script-1.js'
      let req1Resolved = false
      service
        .addScriptToHead(scriptSrc)
        .then(() => {
          req1Resolved = true
        })
        .catch((error) => console.error(error))
      expect(req1Resolved).toBe(false)

      const scriptTags = doc.getElementsByTagName('script')
      expect(scriptTags.length).toBe(2)

      expect(scriptTags[0].src?.replace(/^(https?:\/\/)([^./]+)/, '')).toBe(scriptSrc)
      const scriptEl: HTMLScriptElement = <any>scriptTags[0]
      expect(scriptEl).toBeDefined()
      scriptEl.onload?.(new Event('loaded'))

      await new Promise((res) => setTimeout(res, 0))
      expect(req1Resolved).toBe(true)
    })

    test('request the same script only once', () => {
      const req1 = service.addScriptToHead('/assets/script-2.js')
      const req2 = service.addScriptToHead('/assets/script-2.js')
      expect(req1 === req2).toBe(true)
    })
  })
})
