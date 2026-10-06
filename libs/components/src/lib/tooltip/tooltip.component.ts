import { ConnectedOverlayPositionChange } from '@angular/cdk/overlay'
import { NgClass } from '@angular/common'
import {
  afterNextRender,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Injector,
  OnDestroy,
  viewChild,
} from '@angular/core'
import { Observable, Subject } from 'rxjs'

import { TooltipNotchPosition, TooltipPosition, TooltipPositionSimple } from './tooltip-position.type'
import { TooltipVisibility } from './tooltip-visibility.type'

/**
 * Tooltip component
 * appearance configurable through css custom properties:
 * ```css
 * :root {
 *   --sc-tooltip-background: #888;
 *   --sc-tooltip-color: #eee;
 *   --sc-tooltip-border-radius: 4px;
 *   --sc-tooltip-font-size: 12px;
 *   --sc-tooltip-line-height: 16px;
 *   --sc-tooltip-padding: 4px 8px;
 * }
 * ```
 */
@Component({
  selector: 'sc-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(body:click)': 'this.handleBodyInteraction()',
    'aria-hidden': 'true',
  },
  imports: [NgClass],
})
export class TooltipComponent implements OnDestroy {
  get tooltipPosition(): TooltipPositionSimple {
    return (this._rendererPosition || '').split('-')[0] as TooltipPositionSimple
  }

  get notchPosition(): TooltipNotchPosition {
    return ((this._rendererPosition || '').split('-')[1] || 'center') as TooltipNotchPosition
  }

  /** Message to display in the tooltip */
  message: string

  /** Classes to be added to the tooltip. Supports the same syntax as `ngClass`. */
  tooltipClass: string | string[] | Set<string> | { [key: string]: any }

  /** The timeout ID of any current timer set to show the tooltip */
  //eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  showTimeoutId: any | null

  /** The timeout ID of any current timer set to hide the tooltip */
  //eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  hideTimeoutId: any | null

  /** Visibility state controlling the tooltip's CSS transition classes */
  visibility: TooltipVisibility = 'initial'

  position: TooltipPosition

  readonly notchElRef = viewChild<ElementRef>('notch')
  private readonly tooltipElRef = viewChild.required<ElementRef<HTMLElement>>('tooltip')
  // if there is not enough space in the UI to display the desired position, a fallback position is displayed
  private _rendererPosition: TooltipPosition

  /** Whether interactions on the page should close the tooltip */
  private closeOnInteraction = false

  /** Subject for notifying that the tooltip has been hidden from the view */
  private readonly onHide = new Subject<void>()

  private readonly changeDetectorRef = inject(ChangeDetectorRef)
  private readonly injector = inject(Injector)

  /**
   * Shows the tooltip with an animation originating from the provided origin
   * @param delay Amount of milliseconds to the delay showing the tooltip.
   */
  show(delay: number): void {
    // Cancel the delayed hide if it is scheduled
    if (this.hideTimeoutId) {
      clearTimeout(this.hideTimeoutId)
      this.hideTimeoutId = null
    }

    // Body interactions should cancel the tooltip if there is a delay in showing.
    this.closeOnInteraction = true
    this.showTimeoutId = setTimeout(() => {
      this.visibility = 'visible'
      this.showTimeoutId = null

      // Mark for check so if any parent component has set the
      // ChangeDetectionStrategy to OnPush it will be checked anyways
      this.markForCheck()
    }, delay)
  }

  /**
   * Begins the animation to hide the tooltip after the provided delay in ms.
   * @param delay Amount of milliseconds to delay showing the tooltip.
   */
  hide(delay: number): void {
    // Cancel the delayed show if it is scheduled
    if (this.showTimeoutId) {
      clearTimeout(this.showTimeoutId)
      this.showTimeoutId = null
    }

    this.hideTimeoutId = setTimeout(() => {
      const wasInitial = this.visibility === 'initial'
      this.visibility = 'hidden'
      this.hideTimeoutId = null

      // A tooltip hidden before it is shown has nothing to animate.
      if (wasInitial) {
        this.onHide.next()
        return
      }

      afterNextRender(
        {
          read: () => {
            const element = this.tooltipElRef().nativeElement
            // No transition fires if the tooltip was never painted or transitions are disabled.
            if (
              this.visibility === 'hidden' &&
              element.ownerDocument.defaultView?.getComputedStyle(element).opacity === '0'
            ) {
              this.onHide.next()
            }
          },
        },
        { injector: this.injector },
      )

      // Mark for check so if any parent component has set the
      // ChangeDetectionStrategy to OnPush it will be checked anyways
      this.markForCheck()
    }, delay)
  }

  /** Returns an observable that notifies when the tooltip has been hidden from view. */
  afterHidden(): Observable<void> {
    return this.onHide.asObservable()
  }

  /** Whether the tooltip is being displayed. */
  isVisible(): boolean {
    return this.visibility === 'visible'
  }

  ngOnDestroy() {
    clearTimeout(this.showTimeoutId)
    clearTimeout(this.hideTimeoutId)
    this.onHide.complete()
  }

  protected transitionStart(event: TransitionEvent): void {
    if (this.isTooltipTransition(event)) {
      this.closeOnInteraction = false
    }
  }

  protected transitionDone(event: TransitionEvent): void {
    if (!this.isTooltipTransition(event)) {
      return
    }

    this.closeOnInteraction = true
    if (this.visibility === 'hidden') {
      this.onHide.next()
    }
  }

  private isTooltipTransition(event: TransitionEvent): boolean {
    return event.target === event.currentTarget && event.propertyName === 'opacity' && !event.pseudoElement
  }

  /**
   * Interactions on the HTML body should close the tooltip immediately as defined in the
   * material design spec.
   * https://material.io/design/components/tooltips.html#behavior
   */
  handleBodyInteraction(): void {
    if (this.closeOnInteraction) {
      this.hide(0)
    }
  }

  /**
   * Marks that the tooltip needs to be checked in the next change detection run.
   * Mainly used for rendering the initial text before positioning a tooltip, which
   * can be problematic in components with OnPush change detection.
   */
  markForCheck(): void {
    this.changeDetectorRef.markForCheck()
  }

  updatePosition({ connectionPair }: ConnectedOverlayPositionChange, position: TooltipPosition) {
    this.position = position
    const positions = this.position.split('-')
    const tooltipPosition = positions[0] as TooltipPositionSimple
    const notchPosition: TooltipNotchPosition = (positions[1] as TooltipNotchPosition) || 'center'
    let renderedTooltipPosition: TooltipPosition
    switch (tooltipPosition) {
      case 'above':
        renderedTooltipPosition = (
          connectionPair.originY === 'top' ? `above-${notchPosition}` : `below-${notchPosition}`
        ) as TooltipPosition
        break
      case 'below':
        renderedTooltipPosition = (
          connectionPair.originY === 'bottom' ? `below-${notchPosition}` : `above-${notchPosition}`
        ) as TooltipPosition
        break
      case 'after':
        renderedTooltipPosition = (
          connectionPair.originX === 'end' ? `after-${notchPosition}` : `before-${notchPosition}`
        ) as TooltipPosition
        break
      case 'before':
        renderedTooltipPosition = (
          connectionPair.originX === 'start' ? `before-${notchPosition}` : `after-${notchPosition}`
        ) as TooltipPosition
        break
      default:
        throw new Error('not implemented')
    }

    this._rendererPosition = renderedTooltipPosition
  }
}
