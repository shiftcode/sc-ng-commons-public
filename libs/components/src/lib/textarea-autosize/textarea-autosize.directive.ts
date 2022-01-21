import { AfterViewInit, Directive, ElementRef, HostBinding, Inject, Input, OnDestroy } from '@angular/core'
import { FormControlDirective } from '@angular/forms'
import { Logger, LoggerService, ResizeService } from '@shiftcode/ngx-core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

/**
 * Autosize for TextArea
 * ONLY works with Reactive Forms (necessary to use FormControlDirective)
 */
@Directive({
  selector: 'textarea[scAutosize]',
  host: {
    '[style.resize]': '"none"',
  },
})
export class TextareaAutosizeDirective implements AfterViewInit, OnDestroy {
  @Input()
  @HostBinding('rows')
  rows: number | string = 1

  @HostBinding('style.overflow')
  readonly overflow = 'hidden'

  readonly element: HTMLTextAreaElement

  private readonly onDestroy = new Subject<void>()
  private readonly logger: Logger

  constructor(
    elem: ElementRef,
    loggerService: LoggerService,
    resizeService: ResizeService,
    @Inject(FormControlDirective) private readonly formControlDir: FormControlDirective,
  ) {
    this.logger = loggerService.getInstance('TextareaAutosizeDirective')
    this.element = elem.nativeElement

    resizeService.observe(this.element).pipe(takeUntil(this.onDestroy)).subscribe(this.resize.bind(this))
  }

  ngAfterViewInit() {
    this.resize()

    if (this.formControlDir.control) {
      this.formControlDir.control.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe(this.resize.bind(this))
    } else {
      this.logger.error('FormControl not set yet on FormControlDirective - but necessary')
    }
  }

  ngOnDestroy() {
    this.onDestroy.next()
    this.onDestroy.complete()
  }

  private resize() {
    // Calculate border height which is not included in scrollHeight
    const borderHeight = this.element.offsetHeight - this.element.clientHeight

    // Reset textarea height to auto that correctly calculate the new height
    this.element.style.height = 'auto'

    // Set new height
    this.element.style.height = `${this.element.scrollHeight + borderHeight}px`
  }
}
