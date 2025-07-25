import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion'
import { AfterViewInit, Directive, ElementRef, Input, OnChanges, OnInit, inject } from '@angular/core'

/**
 * Standalone Directive to animate SVG parts by calling beginElement method
 * by default the initially active states are applied without animation (disable behaviour with `withInitAnimation`)
 * @example
 * ```typescript
 *  isOpen = true
 *  iconAnimState: Record<string,boolean> = {'#anim-close': true, '#anim-menu': false }
 *  setState() {
 *    this.isOpen = !this.isOpen
 *    this.iconAnimState = { '#anim-close': this.isOpen,'#anim-menu': !this.isOpen,}
 *  }
 * ```
 * ```html
 *  <sc-svg url="/assets/icon/close-anim.svg" [scSvgAnimate]="iconAnimState" (click)="setState()"></sc-svg>
 *  ```
 */
@Directive({ selector: '[scSvgAnimate]', standalone: true })
export class SvgAnimateDirective implements OnChanges, AfterViewInit, OnInit {
  /**
   * state input in form {selector:state} - will be animated when state === true
   */
  @Input('scSvgAnimate')
  states: Record<string, boolean> | null

  @Input()
  set withInitAnimation(value: BooleanInput) {
    this._withInitAnimation = coerceBooleanProperty(value)
  }

  get withInitAnimation(): boolean {
    return this._withInitAnimation
  }

  readonly element = inject(ElementRef).nativeElement
  private _withInitAnimation = false

  ngOnInit() {
    if (!this.withInitAnimation) {
      // set initial state without animation
      this.getElementsToActivate().forEach((el) => {
        const attr = el.getAttribute('attributeName')
        const value = el.getAttribute('to')
        if (attr && value !== null && el.parentElement) {
          el.parentElement.setAttribute(attr, value)
        }
      })
    }
  }

  ngOnChanges() {
    this.apply()
  }

  ngAfterViewInit() {
    this.apply()
  }

  private apply() {
    this.getElementsToActivate().forEach((el) => el.beginElement())
  }

  private getElementsToActivate(): SVGAnimateElement[] {
    return Object.entries(this.states || {})
      .filter(([, state]) => !!state)
      .map(([selector]) => this.element.querySelector(selector))
      .filter((el): el is SVGAnimateElement & { beginElement: () => void } => !!el && 'beginElement' in el)
  }
}
