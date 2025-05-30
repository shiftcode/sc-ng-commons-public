import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  Renderer2,
  SimpleChange,
} from '@angular/core'
import { LoggerService } from '@shiftcode/ngx-core'
import { Logger } from '@shiftcode/logger'
import { SvgRegistry } from './svg-registry.service'
import { HttpErrorResponse } from '@angular/common/http'

/**
 * Standalone SvgComponent to display svg inline.
 * (Initially copied from material MdIcon Directive but got rid of unused functionality and refactored to Promises)
 *
 *  - Specify the url input to load an SVG icon from a URL.
 *   The SVG content is directly inlined as a child of the <sc-svg> component,
 *   so that CSS styles can easily be applied to it.
 *   The URL is loaded via an XMLHttpRequest, so it must be on the same domain as the page or its
 *   server must be configured to allow cross-domain requests.
 * @example
 *   <sc-svg url="assets/arrow.svg"></sc-svg>
 */
@Component({
  selector: 'sc-svg',
  template: '<ng-content></ng-content>',
  standalone: true,
  styleUrls: ['./svg.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgComponent implements OnChanges {
  @Input({ required: true }) url: string

  @Input() attrs?: Record<string, string>

  protected readonly elRef: ElementRef<HTMLElement> = inject(ElementRef)
  protected readonly renderer = inject(Renderer2)
  protected readonly svgRegistry = inject(SvgRegistry)

  private readonly logger: Logger = inject(LoggerService).getInstance('SvgComponent')

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    // Only update the inline SVG icon if the inputs changed, to avoid unnecessary DOM operations.
    if ('attrs' in changes || 'url' in changes) {
      if (!this.url.endsWith('.svg')) {
        this.logger.warn('svg url does not end with *.svg')
      }
      this.svgRegistry
        .getFromUrl(this.url)
        .then(this.modifySvgElement)
        .then(this.setSvgElement)
        .catch((err: any) => {
          if (err instanceof HttpErrorResponse && err.status === 0) {
            // in case of no internet or a timeout log a warning, we can not do anything about that
            this.logger.warn(`Error retrieving icon for path ${this.url}, due to no network`, err)
          } else {
            this.logger.error(`Error retrieving icon for path ${this.url}`, err)
          }
        })
    }
  }

  private modifySvgElement = (svg: SVGElement): SVGElement => {
    const attrs = this.attrs || {}
    Object.keys(attrs).forEach((key) => svg.setAttribute(key, attrs[key]))
    return svg
  }

  private setSvgElement = (svg: SVGElement | null) => {
    const layoutElement = this.elRef.nativeElement
    // Remove existing child nodes and add the new SVG element.
    layoutElement.innerHTML = ''
    this.renderer.appendChild(layoutElement, svg)
  }
}
