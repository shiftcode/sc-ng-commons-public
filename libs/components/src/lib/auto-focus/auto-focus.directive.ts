import { DOCUMENT } from '@angular/common'
import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core'
import { isInputElement, Logger, LoggerService } from '@shiftcode/ngx-core'

/**
 * Standalone Autofocus Directive
 * tries to set focus on host element in ngAfterViewInit lifecycle
 * if initially not focusable, the directive sets `tabindex` to -1 and retries.
 * -- will not remove the potentially set tabindex
 */
@Directive({
  selector: '[scAutoFocus]',
})
export class AutoFocusDirective implements AfterViewInit {
  readonly element: HTMLElement = inject(ElementRef).nativeElement
  private readonly document: Document = inject(DOCUMENT)
  private readonly logger: Logger = inject(LoggerService).getInstance('AutoFocusDirective')

  ngAfterViewInit(): void {
    this.focus()
  }

  focus(): boolean {
    if (ngDevMode) {
      this.logger.debug('try set focus to', this.element)

      if (this.isDisabled() || this.isHiddenInput()) {
        this.logger.warn('you are trying to focus a disabled element or hidden input')
      }
    }

    this.element.focus()
    if (this.document.activeElement !== this.element) {
      this.element.setAttribute('tabindex', '-1')
      this.element.focus()
    }

    if (ngDevMode) {
      if (this.document.activeElement !== this.element) {
        this.logger.error('not able to focus the element', this.element)
      }
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
