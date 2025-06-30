import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { inject, Injectable, DOCUMENT } from '@angular/core'
import { firstValueFrom } from 'rxjs'

/**
 * Service to load, cache and create svg elements
 */
@Injectable({ providedIn: 'root' })
export class SvgRegistry {
  private readonly cache = new Map<string, Promise<SVGElement>>()
  private readonly document = inject(DOCUMENT)
  private readonly httpClient = inject(HttpClient)

  /**
   * Creates a DOM element from the given SVG string, and adds default attributes.
   */
  static createSvgElementFromString(svgString: string, doc: Document): SVGElement {
    // Creates a DOM element from the given SVG string.
    const div = doc.createElement('DIV')
    div.innerHTML = svgString
    const svg = <SVGElement>div.querySelector('svg')
    if (!svg) {
      throw new Error('Could not find svg')
    }

    // remove style tags within the svg since they are global and shouldn't be used.
    const styleTags = Array.from(svg.querySelectorAll('style'))
    styleTags.forEach((styleTag) => styleTag.remove())

    // set attributes
    if (!svg.getAttribute('xmlns')) {
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    }
    svg.setAttribute('fit', '')
    svg.setAttribute('height', '100%')
    svg.setAttribute('width', '100%')
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    svg.setAttribute('focusable', 'false') // Disable IE11 default behavior to make SVGs focusable.

    return svg
  }

  /**
   * Returns a Promise that produces the icon (as an <svg> DOM element) from the given URL.
   * The response from the URL may be cached so this will not always cause an HTTP request, but
   * the produced element will always be a new copy of the originally fetched icon.
   * (That is, it will not contain any modifications made to elements previously returned).
   */
  async getFromUrl(url: string): Promise<SVGElement> {
    const svg = await this.getFromCacheOrLoadFromUrl(url)
    // always clone it
    return <SVGElement>svg.cloneNode(true)
  }

  /**
   * returns the svg resolving promise either from cache or from a new request.
   */
  private getFromCacheOrLoadFromUrl(url: string): Promise<SVGElement> {
    let promise = this.cache.get(url)
    if (!promise) {
      // create promise and add to cache
      promise = this.loadSvgFromUrl(url)
      this.cache.set(url, promise)
      promise.catch((err) => {
        if (err instanceof HttpErrorResponse && err.status === 0) {
          // in case of no internet or a timeout we remove the cached promise, so it can be retried
          this.cache.delete(url)
        }
      })
    }
    return promise
  }

  /**
   * Loads the content of the url as text and creates an SVG element from it.
   */
  private async loadSvgFromUrl(url: string): Promise<SVGElement> {
    const svg = await firstValueFrom(this.httpClient.get(url, { responseType: 'text' }))
    return SvgRegistry.createSvgElementFromString(svg, this.document)
  }
}
