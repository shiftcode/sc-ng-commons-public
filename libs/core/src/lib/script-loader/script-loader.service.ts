import { DOCUMENT, isPlatformServer } from '@angular/common'
import { Inject, Injectable, PLATFORM_ID } from '@angular/core'
import { Logger } from '../logger/logger.model'
import { LoggerService } from '../logger/logger.service'
import { ScriptLoaderError } from './script-loader-error.model'

/** @dynamic */
@Injectable({ providedIn: 'root' })
export class ScriptLoaderService {
  private static ELEMENT = 'script'

  private loadedScripts: Map<string, Promise<void>> = new Map()
  private logger: Logger
  private document: Document

  constructor(
    loggerService: LoggerService,
    @Inject(DOCUMENT) document: Document,
    @Inject(PLATFORM_ID) platformId: any,
  ) {
    this.logger = loggerService.getInstance('ScriptLoaderService')

    if (isPlatformServer(platformId)) {
      this.logger.warn('This service can only be used on client side')
    }
    this.document = document
  }

  addScriptToHead(url: string, async?: boolean): Promise<void> {
    this.logger.debug('got request to load script with url : %s', url)
    const existingRequest = this.loadedScripts.get(url)
    if (existingRequest) {
      this.logger.info(
        "script loading was already requested, won't load the script twice, returning current request to subscribe too (%s)",
        url,
      )
      return existingRequest
    } else {
      const firstScriptElem = this.document.getElementsByTagName(ScriptLoaderService.ELEMENT)[0]
      const scriptsElParent = firstScriptElem?.parentNode
      if (firstScriptElem && scriptsElParent) {
        const request = new Promise<void>((resolve, reject) => {
          this.logger.debug('adding script element to trigger the loading of the script')
          const scriptElement = this.createScriptElement(
            url,
            // on load success
            () => {
              this.logger.info('script (%s) was succesfuly loaded', url)
              resolve(void 0)
            },
            // on load error
            (cause) => {
              const err = new ScriptLoaderError(`there was an error loading the script for url ${url}`, url, cause)
              this.logger.error(err)
              reject(err)
            },
            async,
          )
          scriptsElParent.insertBefore(scriptElement, firstScriptElem)
        })
        this.loadedScripts.set(url, request)
        return request
      } else {
        throw new ScriptLoaderError('there is no script tag present in the current document', url)
      }
    }
  }

  private createScriptElement(
    url: string,
    onLoadFn: () => void,
    onErrorFn: OnErrorEventHandler,
    async?: boolean,
  ): HTMLScriptElement {
    const element: HTMLScriptElement = <HTMLScriptElement>this.document.createElement(ScriptLoaderService.ELEMENT)
    element.src = url
    element.type = 'text/javascript'
    if (async === true) {
      element.async = async
    }

    element.onload = onLoadFn
    element.onerror = onErrorFn

    return element
  }
}
