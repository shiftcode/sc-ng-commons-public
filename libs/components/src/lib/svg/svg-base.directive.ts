import { HttpErrorResponse } from '@angular/common/http'
import { Directive, effect, ElementRef, inject, Renderer2, Signal } from '@angular/core'
import { Logger } from '@shiftcode/logger'

import { SvgRegistry } from './svg-registry.service'

/**
 * Base class for components that display an SVG element inline.
 * The SVG content is directly inlined as a child of the component, so that CSS styles can easily be applied to it.
 */
@Directive()
export abstract class SvgBaseDirective {
  protected readonly elRef = inject<ElementRef<HTMLElement>>(ElementRef)
  protected readonly renderer = inject(Renderer2)
  protected readonly svgRegistry = inject(SvgRegistry)

  protected abstract readonly logger: Logger
  protected abstract readonly data: Signal<{ url: string; attrs?: Record<string, string> }>

  constructor() {
    effect((onCleanup) => {
      const { url, attrs } = this.data()
      const abortController = new AbortController()
      this.getAndSet(url, attrs, abortController.signal)
      onCleanup(() => abortController.abort())
    })
  }

  private getAndSet(url: string, attrs: Record<string, string> | undefined, abortSignal: AbortSignal) {
    // due to the caching in SvgRegistry we cannot simply abort the fetching of the svg.
    // but we ensure that we do not set the svg element if the abort signal has been triggered in the meantime.
    this.svgRegistry
      .getFromUrl(url)
      .then(this.getSvgModifierFn(attrs))
      .then(this.getSvgSetterFn(abortSignal))
      .catch((err: any) => {
        if (err instanceof HttpErrorResponse && err.status === 0) {
          // in case of no internet or a timeout log a warning, we can not do anything about that
          this.logger.debug(`Error retrieving icon for path ${url}, due to no network`, err)
        } else {
          this.logger.error(`Error retrieving icon for path ${url}`, err)
        }
      })
  }

  private getSvgModifierFn(attrs?: Record<string, string>) {
    const attrsEntries = attrs ? Object.entries(attrs) : []
    if (attrsEntries.length === 0) {
      return (svg: SVGElement): SVGElement => svg
    }

    return (svg: SVGElement): SVGElement => {
      for (const [key, val] of attrsEntries) {
        svg.setAttribute(key, val)
      }
      return svg
    }
  }

  private getSvgSetterFn = (abortSignal: AbortSignal) => {
    return (svg: SVGElement) => {
      if (abortSignal.aborted) {
        this.logger.debug('Aborting setSvgElement due to abort signal')
        return
      }
      // Remove existing child nodes and add the new SVG element.
      this.elRef.nativeElement.innerHTML = ''
      this.renderer.appendChild(this.elRef.nativeElement, svg)
    }
  }
}
