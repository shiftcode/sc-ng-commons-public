import { Directive, ElementRef, inject, OnChanges, OnDestroy, input, output } from '@angular/core'
import { UIEventService } from '@shiftcode/ngx-core'
import { Subscription } from 'rxjs'

/**
 * Standalone Directive to listen for 'outside' element clicks
 */
@Directive({ selector: '[scClickOutside]', standalone: true })
export class ClickOutsideDirective implements OnDestroy, OnChanges {
  readonly disabled = input(false, { alias: 'scClickOutsideDisabled' })

  readonly scClickOutside = output<Event>()

  private subscription?: Subscription
  private readonly element: HTMLElement = inject(ElementRef).nativeElement
  private readonly uiEventService = inject(UIEventService)

  ngOnChanges(): void {
    // as there is only one input, ngOnChanges is only called when `isActive` changes
    this.subscription?.unsubscribe()
    if (!this.disabled()) {
      this.subscription = this.uiEventService.forEvent(['click', 'touchstart']).subscribe(this.handleDocumentClick)
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  private handleDocumentClick = (event: Event) => {
    if (!(this.element === event.target || this.element.contains(<Node>event.target))) {
      this.scClickOutside.emit(event)
    }
  }
}
