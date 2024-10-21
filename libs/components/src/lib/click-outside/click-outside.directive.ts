import { Directive, ElementRef, EventEmitter, inject, Input, OnChanges, OnDestroy, Output } from '@angular/core'
import { UIEventService } from '@shiftcode/ngx-core'
import { Subscription } from 'rxjs'

/**
 * Standalone Directive to listen for 'outside' element clicks
 */
@Directive({ selector: '[scClickOutside]', standalone: true })
export class ClickOutsideDirective implements OnDestroy, OnChanges {
  @Input('scClickOutsideDisabled') disabled = false

  @Output() readonly scClickOutside = new EventEmitter<Event>()

  private subscription?: Subscription
  private readonly element: HTMLElement = inject(ElementRef).nativeElement

  constructor(private uiEventService: UIEventService) {}

  ngOnChanges(): void {
    // as there is only one input, ngOnChanges is only called when `isActive` changes
    this.subscription?.unsubscribe()
    if (!this.disabled) {
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
