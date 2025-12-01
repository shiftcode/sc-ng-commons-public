import { afterNextRender, Directive, ElementRef, HostBinding, inject, input } from '@angular/core'
import { FormControlDirective } from '@angular/forms'
import { LoggerService, onDestroy, ResizeService } from '@shiftcode/ngx-core'
import { Logger } from '@shiftcode/logger'
import { takeUntil } from 'rxjs/operators'

/**
 * Standalone AutosizeDirective for TextArea
 * ONLY works with Reactive Forms (necessary to use FormControlDirective)
 */
@Directive({
  selector: 'textarea[scAutosize]',
  standalone: true,
  host: {
    '[style.resize]': '"none"',
    '[style.overflow]': '"hidden"',
  },
})
export class TextareaAutosizeDirective {
  @HostBinding('rows')
  readonly rows = input<number | string>(1)

  readonly element: HTMLTextAreaElement = inject(ElementRef).nativeElement

  private readonly formControlDir = inject(FormControlDirective)
  private readonly logger: Logger = inject(LoggerService).getInstance('TextareaAutosizeDirective')
  private readonly onDestroy$ = onDestroy()

  constructor() {
    afterNextRender(() => {
      this.resize()

      if (this.formControlDir.control) {
        this.formControlDir.control.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(this.resize.bind(this))
      } else {
        this.logger.error('FormControl not set yet on FormControlDirective - but necessary')
      }
    })
    inject(ResizeService).observe(this.element).pipe(takeUntil(this.onDestroy$)).subscribe(this.resize.bind(this))
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
