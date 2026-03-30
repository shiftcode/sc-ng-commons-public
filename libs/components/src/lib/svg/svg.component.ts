import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core'
import { Logger } from '@shiftcode/logger'
import { LoggerService } from '@shiftcode/ngx-core'

import { SvgBaseDirective } from './svg-base.directive'

/**
 * Standalone SvgComponent to display svg inline.
 *
 *  - Specify the url input to load an SVG icon from a URL.
 *   The SVG content is directly inlined as a child of the <sc-svg> component,
 *   so that CSS styles can easily be applied to it.
 *   The URL is loaded via Angular's {@link HttpClient}, it must be on the same domain as the page or its
 *   server must be configured to allow cross-domain requests.
 * @example
 *   <sc-svg url="assets/arrow.svg" />
 */
@Component({
  selector: 'sc-svg',
  template: '<ng-content />',
  standalone: true,
  styleUrls: ['./svg.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgComponent extends SvgBaseDirective {
  readonly url = input.required<string>()

  readonly attrs = input<Record<string, string>>({})

  protected readonly logger: Logger = inject(LoggerService).getInstance('SvgComponent')
  protected readonly data = computed(() => ({
    url: this.url(),
    attrs: this.attrs(),
  }))
}
