import { Directive, effect, ElementRef, inject, input, output } from '@angular/core'
import { UIEventService } from '@shiftcode/ngx-core'

/**
 * Standalone Directive to listen for 'outside' element clicks
 */
@Directive({ selector: '[scClickOutside]', standalone: true })
export class ClickOutsideDirective {
  readonly disabled = input(false, { alias: 'scClickOutsideDisabled' })

  readonly scClickOutside = output<Event>()

  private readonly element: HTMLElement = inject(ElementRef).nativeElement
  private readonly uiEventService = inject(UIEventService)

  constructor() {
    effect((onCleanup) => {
      if (!this.disabled()) {
        const sub = this.uiEventService.forEvent(['click', 'touchstart']).subscribe(this.handleDocumentClick)
        onCleanup(() => sub.unsubscribe())
      }
    })
  }

  private handleDocumentClick = (event: Event) => {
    if (!(this.element === event.target || this.element.contains(<Node>event.target))) {
      this.scClickOutside.emit(event)
    }
  }
}
