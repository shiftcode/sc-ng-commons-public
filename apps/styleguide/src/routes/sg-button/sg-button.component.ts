import { ChangeDetectionStrategy, Component, Inject, OnDestroy, Optional, DOCUMENT } from '@angular/core'
import { ButtonComponent } from '@shiftcode/ngx-components'

@Component({
  selector: 'sg-button',
  imports: [ButtonComponent],
  templateUrl: './sg-button.component.html',
  styleUrls: ['./sg-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SgButtonComponent implements OnDestroy {
  counter1 = 0
  counter2 = 0
  counter3 = 0

  activeEl: string | null

  isToggled = false

  private document?: Document
  private intervalId: any

  constructor(@Optional() @Inject(DOCUMENT) document?: any) {
    this.document = document
    this.intervalId = setInterval(this.updateActiveEl, 100)
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId)
  }

  private updateActiveEl = (): string | null => {
    return (this.activeEl =
      (this.document &&
        this.document.activeElement &&
        `${this.document.activeElement.tagName}#${this.document.activeElement.id}`) ||
      null)
  }
}
