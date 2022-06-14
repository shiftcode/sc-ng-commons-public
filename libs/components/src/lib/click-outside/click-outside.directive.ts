import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core'
import { UIEventService } from '@shiftcode/ngx-core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Directive({ selector: '[scClickOutside]' })
export class ClickOutsideDirective implements OnDestroy, OnChanges {
  @Input('scClickOutside') // tslint:disable-line:no-input-rename
  isActive: boolean

  /* tslint:disable-next-line:no-output-rename */
  @Output('scClickOutside')
  readonly notify = new EventEmitter<void>()

  private stopEventListener = new Subject<void>()

  constructor(private elementRef: ElementRef, private uiEventService: UIEventService) {}

  ngOnDestroy(): void {
    this.stopEventListener.next()
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change: SimpleChange = changes['isActive']

    if (change) {
      if (change.currentValue === true) {
        this.uiEventService
          .forEvent(['click', 'touchstart'])
          .pipe(takeUntil(this.stopEventListener))
          .subscribe(this.handleDocumentClick)
      } else {
        this.stopEventListener.next()
      }
    }
  }

  private handleDocumentClick = (event: Event): void => {
    const isElement: boolean = this.elementRef.nativeElement === event.target

    let isWithinClickedElement = true
    if (!isElement) {
      isWithinClickedElement = this.elementRef.nativeElement.contains(<HTMLElement>event.target)
    }

    if (!isElement && !isWithinClickedElement) {
      this.notify.emit()
    }
  }
}
