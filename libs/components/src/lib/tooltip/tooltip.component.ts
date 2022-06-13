// tslint:disable:use-host-property-decorator
// tslint:disable:no-host-metadata-property
import { AnimationEvent, trigger } from '@angular/animations'
import { ConnectedOverlayPositionChange } from '@angular/cdk/overlay'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { TooltipNotchPosition, TooltipPosition, TooltipPositionSimple } from './tooltip-position.type'
import { TooltipVisibility } from './tooltip-visibility.type'
import { tooltipAnimation } from './tooltip.animation'

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
  animations: [trigger('state', tooltipAnimation)],
  host: {
    // Forces the element to have a layout in IE and Edge. This fixes issues where the element
    // won't be rendered if the animations are disabled or there is no web animations polyfill.
    '[style.zoom]': 'visibility === "visible" ? 1 : null',
    '(body:click)': 'this.handleBodyInteraction()',
    'aria-hidden': 'true',
  },
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
  showTimeoutId: any | null

  /** The timeout ID of any current timer set to hide the tooltip */
  hideTimeoutId: any | null

  /** Property watched by the animation framework to show or hide the tooltip */
  visibility: TooltipVisibility = 'initial'

  position: TooltipPosition

  @ViewChild('notch', { static: true })
  notchElRef: ElementRef
  // if there is not enough space in the UI to display the desired position, a fallback position is displayed
  private _rendererPosition: TooltipPosition

  /** Whether interactions on the page should close the tooltip */
  private closeOnInteraction = false

  /** Subject for notifying that the tooltip has been hidden from the view */
  private readonly onHide = new Subject<void>()

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

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
      this.visibility = 'hidden'
      this.hideTimeoutId = null

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
    this.onHide.complete()
  }

  animationStart() {
    this.closeOnInteraction = false
  }

  animationDone(event: AnimationEvent): void {
    const toState: TooltipVisibility = (<any>event).toState

    if (toState === 'hidden' && !this.isVisible()) {
      this.onHide.next()
    }

    if (toState === 'visible' || toState === 'hidden') {
      this.closeOnInteraction = true
    }
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
