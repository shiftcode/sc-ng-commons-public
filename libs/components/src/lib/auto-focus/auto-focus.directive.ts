import { DOCUMENT } from '@angular/common'
import { Directive, ElementRef, Inject, OnInit } from '@angular/core'
import { Logger, LoggerService } from '@shiftcode/ngx-core'

@Directive({ selector: '[scAutoFocus]' })
export class AutoFocusDirective implements OnInit {
  private readonly logger: Logger
  private document: Document

  constructor(loggerService: LoggerService, private elRef: ElementRef, @Inject(DOCUMENT) doc: any) {
    this.logger = loggerService.getInstance('AutoFocusDirective')
    this.document = doc
  }

  get nativeElement() {
    return this.elRef.nativeElement
  }

  ngOnInit(): void {
    const currentTabindex = this.nativeElement.getAttribute('tabindex')
    // tslint:disable-next-line:triple-equals
    if (!currentTabindex || parseInt(currentTabindex, 10) != currentTabindex) {
      this.nativeElement.setAttribute('tabindex', '-1')
    }
    this.focus()
  }

  focus() {
    this.logger.debug('try get focus on', this.nativeElement)
    this.nativeElement.focus()
    this.logger.debug('active element:', this.document.activeElement)
  }
}
