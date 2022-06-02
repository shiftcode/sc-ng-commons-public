import { DOCUMENT } from '@angular/common'
import { Directive, ElementRef, inject, OnInit } from '@angular/core'
import { Logger, LoggerService } from '@shiftcode/ngx-core'

@Directive({ selector: '[scAutoFocus]' })
export class AutoFocusDirective implements OnInit {
  readonly element: HTMLElement = inject(ElementRef).nativeElement
  private readonly document: Document = inject(DOCUMENT)
  private readonly logger: Logger = inject(LoggerService).getInstance('AutoFocusDirective')

  ngOnInit(): void {
    const currentTabindex = this.element.getAttribute('tabindex')
    if (!currentTabindex || String(parseInt(currentTabindex, 10)) !== currentTabindex) {
      this.element.setAttribute('tabindex', '-1')
    }
    this.focus()
  }

  focus() {
    this.logger.debug('try get focus on', this.element)
    this.element.focus()
    this.logger.debug('active element:', this.document.activeElement)
  }
}
