import { animate, style, transition, trigger } from '@angular/animations'
import { Component, ElementRef, HostBinding, Input, OnChanges, inject } from '@angular/core'

/**
 * Standalone Component to smoothly animate height changes.
 * Animates the height property when the content of sc-smooth-height changes
 * use the {@link trigger} input to provide the essential value changes to trigger a resize
 */
@Component({
  selector: 'sc-smooth-height',
  standalone: true,
  template: `<ng-content />`,
  styleUrls: ['./smooth-height.component.scss'],
  animations: [
    trigger('grow', [
      transition('void <=> *', []),
      transition('* <=> *', [style({ height: '{{startHeight}}px' }), animate('300ms ease-in-out')], {
        params: { startHeight: 0 },
      }),
    ]),
  ],
})
export class SmoothHeightComponent implements OnChanges {
  @Input()
  trigger: any

  private startHeight: number
  private readonly element = inject(ElementRef)

  @HostBinding('@grow')
  get grow() {
    return { value: this.trigger, params: { startHeight: this.startHeight } }
  }

  ngOnChanges() {
    this.setStartHeight()
  }

  private setStartHeight() {
    this.startHeight = this.element.nativeElement.clientHeight
  }
}
