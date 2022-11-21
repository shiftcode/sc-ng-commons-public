// tslint:disable:no-host-metadata-property
import { Component, EventEmitter, HostListener, Output } from '@angular/core'

/**
 * Standalone Button Component.
 * This component imitates a standard button.
 * why? cuz safari and firefox behave silly on OSX: onMousedown, the focus is set to body instead the button
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#Clicking_and_focus
 */
@Component({
  selector: 'sc-button',
  template: ` <ng-content></ng-content> `,
  styleUrls: ['./button.component.scss'],
  standalone: true,
  host: {
    role: 'button',
    tabindex: '0',
  },
})
export class ButtonComponent {
  @Output()
  readonly action = new EventEmitter<void>()

  @HostListener('keypress', ['$event'])
  onKeypress(event: KeyboardEvent) {
    switch (event.code) {
      case 'Enter':
      case 'Space':
        this.action.emit()
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    this.action.emit()
  }
}
