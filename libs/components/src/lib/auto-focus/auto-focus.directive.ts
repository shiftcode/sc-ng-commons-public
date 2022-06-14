import { DOCUMENT } from '@angular/common'
import { Directive, ElementRef, Inject, OnInit } from '@angular/core'
import { isInputElement, Logger, LoggerService } from '@shiftcode/ngx-core'

@Directive({ selector: '[scAutoFocus]' })
export class AutoFocusDirective implements OnInit {
  readonly element: HTMLElement
  private readonly logger: Logger

  constructor(
    loggerService: LoggerService,
    elRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
    this.logger = loggerService.getInstance('AutoFocusDirective')
    this.element = elRef.nativeElement
  }

  ngOnInit(): void {
    this.focus()
  }

  focus(): boolean {
    if (this.isDisabled() || this.isHiddenInput()) {
      this.logger.warn('cannot focus disabled element or hidden input')
      return false
    }

    this.logger.debug('try set focus to', this.element)

    this.element.focus()
    if (this.document.activeElement !== this.element) {
      this.element.setAttribute('tabindex', '-1')
      this.element.focus()
    }
    return this.document.activeElement === this.element
  }

  private isDisabled() {
    // using `matches` for the pseudo selector also correctly returns true when
    // e.g. the directive is used in an input field inside a disabled fieldset
    return this.element.hasAttribute('disabled') || this.element.matches(':disabled')
  }

  private isHiddenInput() {
    return isInputElement(this.element) && this.element.type === 'hidden'
  }
}
