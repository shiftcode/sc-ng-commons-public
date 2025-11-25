import { afterNextRender, booleanAttribute, Directive, effect, ElementRef, inject, input } from '@angular/core'

type SvgAnimationStates = Record<string, boolean>
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
export class SvgAnimateDirective {
  /**
   * state input in form {selector:state} - will be animated when state === true
   */
  readonly states = input(
    {},
    { alias: 'scSvgAnimate', transform: (states: SvgAnimationStates | null | undefined) => states ?? {} },
  )

  readonly withInitAnimation = input(false, { transform: booleanAttribute })

  readonly element: HTMLElement = inject(ElementRef).nativeElement

  constructor() {
    effect(() => {
      this.apply(this.states())
    })

    afterNextRender(() => {
      if (!this.withInitAnimation()) {
        // set initial state without animation
        this.getElementsToActivate(this.states()).forEach((el) => {
          const attr = el.getAttribute('attributeName')
          const value = el.getAttribute('to')
          if (attr && value !== null && el.parentElement) {
            el.parentElement.setAttribute(attr, value)
          }
        })
      }
    })
  }

  private apply(states: SvgAnimationStates) {
    this.getElementsToActivate(states).forEach((el) => el.beginElement())
  }

  private getElementsToActivate(states: SvgAnimationStates): SVGAnimateElement[] {
    return Object.entries(states || {})
      .filter(([, state]) => !!state)
      .map(([selector]) => this.element.querySelector(selector))
      .filter((el): el is SVGAnimateElement & { beginElement: () => void } => !!el && 'beginElement' in el)
  }
}
