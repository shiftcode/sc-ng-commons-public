import { AriaDescriber, FocusMonitor } from '@angular/cdk/a11y'
import { ESCAPE } from '@angular/cdk/keycodes'
import {
  FlexibleConnectedPositionStrategy,
  HorizontalConnectionPos,
  OriginConnectionPosition,
  Overlay,
  OverlayConnectionPosition,
  OverlayContainer,
  OverlayRef,
  ScrollDispatcher,
  VerticalConnectionPos,
  ViewportRuler,
} from '@angular/cdk/overlay'
import { Platform } from '@angular/cdk/platform'
import { ComponentPortal } from '@angular/cdk/portal'

import {
  booleanAttribute,
  Directive,
  DOCUMENT,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  NgZone,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core'
import { Subject } from 'rxjs'
import { take, takeUntil } from 'rxjs/operators'
import { FlexibleConnectedPositionStrategy2 } from './flexible-connected-position-strategy-2'
import { TOOLTIP_DEFAULT_OPTIONS } from './tooltip-default-options.token'
import { defaultTooltipOptions, TooltipOptions } from './tooltip-options.model'
import { TooltipNotchPosition, TooltipPositionSimple } from './tooltip-position.type'
import { TooltipComponent } from './tooltip.component'

function transformMessage(value: string | number | null | undefined): string {
  return value !== null ? `${value}`.trim() : ''
}

/**
 * Tooltip directive which will trigger the tooltip.
 * see {@link TooltipComponent} for customization.
 */
@Directive({
  selector: '[scTooltip]',
  exportAs: 'scTooltip',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  readonly #opts: TooltipOptions = { ...defaultTooltipOptions, ...inject(TOOLTIP_DEFAULT_OPTIONS, { optional: true }) }

  /** Disables the display of the tooltip. */
  readonly disabled = input(false, { transform: booleanAttribute })

  /** The message to be displayed in the tooltip */
  readonly message = input('', { alias: 'scTooltip', transform: transformMessage })

  /** Classes to be passed to the tooltip. Supports the same syntax as `ngClass`. */
  /* eslint-disable @angular-eslint/no-input-rename */
  readonly tooltipClass = input<string | string[] | Set<string> | { [key: string]: any }>('', {
    alias: 'scTooltipClass',
  })

  /** Allows the user to define the position of the tooltip relative to the parent element */
  readonly position = input(this.#opts.position, { alias: 'scTooltipPosition' })

  /** The default delay in ms before showing the tooltip after show is called */
  readonly showDelay = input<number>(undefined, { alias: 'scTooltipShowDelay' })

  /** The default delay in ms before hiding the tooltip after hide is called */
  readonly hideDelay = input<number>(undefined, { alias: 'scTooltipHideDelay' })

  private readonly overlay = inject(Overlay)
  private readonly viewportRuler = inject(ViewportRuler)
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  private readonly scrollDispatcher = inject(ScrollDispatcher)
  private readonly viewContainerRef = inject(ViewContainerRef)
  private readonly ngZone = inject(NgZone)
  private readonly ariaDescriber = inject(AriaDescriber)
  private readonly focusMonitor = inject(FocusMonitor)
  private readonly platform = inject(Platform)
  private readonly overlayContainer = inject(OverlayContainer)
  private readonly document = inject(DOCUMENT)

  private overlayRef: OverlayRef | null
  private tooltipInstance: TooltipComponent | null
  private portal: ComponentPortal<TooltipComponent>
  private readonly manualHostElementListeners = new Map<string, EventListenerOrEventListenerObject>()
  private readonly onDestroy = new Subject<void>()

  private previousMessage = ''

  constructor() {
    this.manualHostElementListeners
      .set('touchstart', () => this.show())
      .set('touchend', () => this.hide(this.#opts.touchendHideDelay))

    // The mouse events shouldn't be bound on mobile devices, because they can prevent the
    // first tap from firing its click event or can cause the tooltip to open for clicks.
    if (!this.platform.IOS && !this.platform.ANDROID) {
      this.manualHostElementListeners.set('mouseenter', () => this.show()).set('mouseleave', () => this.hide())
    }
    // we register them all as passive, as we will never call `preventDefault` on them
    //  basically `passive` would only be needed for `touch*` events
    this.manualHostElementListeners.forEach((listener, event) => {
      this.elementRef.nativeElement.addEventListener(event, listener, { passive: true })
    })

    this.focusMonitor
      .monitor(this.elementRef)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((origin) => {
        // Note that the focus monitor runs outside the Angular zone.
        if (!origin) {
          this.ngZone.run(() => this.hide(0))
        } else if (origin === 'keyboard') {
          this.ngZone.run(() => this.show())
        }
      })

    effect(() => {
      if (this.disabled()) {
        // If tooltip is disabled, hide immediately.
        this.hide(0)
      }
    })

    effect(() => {
      const currentMessage = this.message()

      // Remove old aria description
      this.ariaDescriber.removeDescription(this.elementRef.nativeElement, this.previousMessage)

      if (!currentMessage && this.isTooltipVisible()) {
        this.hide(0)
      } else {
        this.updateTooltipMessage()
        this.ariaDescriber.describe(this.elementRef.nativeElement, currentMessage)
      }

      // Update previous message
      this.previousMessage = currentMessage
    })

    effect(() => {
      if (this.tooltipInstance) {
        this.setTooltipClass(this.tooltipClass())
      }
    })

    effect(() => {
      const currentPosition = this.position()

      if (this.tooltipInstance) {
        this.tooltipInstance.position = currentPosition
      }

      if (this.overlayRef) {
        this.updatePosition()
        if (this.tooltipInstance) {
          this.tooltipInstance.show(0)
        }
        this.overlayRef.updatePosition()
      }
    })
  }

  /**
   * Dispose the tooltip when destroyed.
   */
  ngOnDestroy() {
    if (this.overlayRef) {
      this.overlayRef.dispose()
      this.tooltipInstance = null
    }

    // Clean up the event listeners set in the constructor
    this.manualHostElementListeners.forEach((listener, event) =>
      this.elementRef.nativeElement.removeEventListener(event, listener),
    )
    this.manualHostElementListeners.clear()

    this.onDestroy.next()
    this.onDestroy.complete()

    this.ariaDescriber.removeDescription(this.elementRef.nativeElement, this.message())
    this.focusMonitor.stopMonitoring(this.elementRef)
  }

  /** Shows the tooltip after the delay in ms, defaults to tooltip-delay-show or 0ms if no input */
  show(delay?: number): void {
    delay = delay ?? this.showDelay() ?? this.#opts.showDelay
    if (
      this.disabled() ||
      !this.message() ||
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (this.isTooltipVisible() && !this.tooltipInstance!.showTimeoutId && !this.tooltipInstance!.hideTimeoutId)
    ) {
      return
    }

    const overlayRef = this.createOverlay()

    this.detach()
    this.portal = this.portal || new ComponentPortal(TooltipComponent, this.viewContainerRef)
    this.tooltipInstance = overlayRef.attach(this.portal).instance
    this.tooltipInstance.position = this.position()
    this.tooltipInstance
      .afterHidden()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => this.detach())

    this.setTooltipClass(this.tooltipClass())

    this.updateTooltipMessage()

    this.tooltipInstance.show(delay)
  }

  /** Hides the tooltip after the delay in ms, defaults to tooltip-delay-hide or 0ms if no input */
  hide(delay?: number): void {
    delay = delay ?? this.hideDelay() ?? this.#opts.hideDelay
    if (this.tooltipInstance) {
      this.tooltipInstance.hide(delay)
    }
  }

  /** Shows/hides the tooltip */
  toggle(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.isTooltipVisible() ? this.hide() : this.show()
  }

  /** Returns true if the tooltip is currently visible to the user */
  isTooltipVisible(): boolean {
    return !!this.tooltipInstance && this.tooltipInstance.isVisible()
  }

  /** Handles the keydown events on the host element. */
  @HostListener('keydown', ['$event'])
  handleKeydown(e: KeyboardEvent) {
    if (this.isTooltipVisible() && (e.keyCode === ESCAPE || e.key === 'Escape')) {
      e.stopPropagation()
      this.hide(0)
    }
  }

  /**
   * Returns the origin position and a fallback position based on the user's position preference.
   * The fallback position is the inverse of the origin (e.g. `'below' -> 'above'`).
   */
  private getOrigin(): { main: OriginConnectionPosition; fallback: OriginConnectionPosition } {
    const position = this.position()
    let originPosition: OriginConnectionPosition = { originX: 'center', originY: 'center' }

    const positions = position.split('-')
    const tooltipPosition = positions[0] as TooltipPositionSimple
    const notchPosition = (positions[1] || 'center') as TooltipNotchPosition

    switch (tooltipPosition) {
      case 'above':
        originPosition = { originX: notchPosition, originY: 'top' }
        break
      case 'below':
        originPosition = { originX: notchPosition, originY: 'bottom' }
        break
      case 'before':
        originPosition = { originX: 'start', originY: notchPositionToVertical(notchPosition) }
        break
      case 'after':
        originPosition = { originX: 'end', originY: notchPositionToVertical(notchPosition) }
        break
      default:
        throw Error(`Tooltip position "${position}" is invalid.`)
    }

    const { x, y } = this.invertPosition(originPosition.originX, originPosition.originY)

    return {
      main: originPosition,
      fallback: { originX: x, originY: y },
    }
  }

  /**
   * Returns the overlay position and a fallback position based on the user's preference
   */
  private getOverlayPosition(): { main: OverlayConnectionPosition; fallback: OverlayConnectionPosition } {
    const position = this.position()
    let overlayPosition: OverlayConnectionPosition

    const positions = position.split('-')
    const tooltipPosition = positions[0] as TooltipPositionSimple
    const notchPosition = (positions[1] || 'center') as TooltipNotchPosition

    switch (tooltipPosition) {
      case 'above':
        overlayPosition = { overlayX: notchPosition, overlayY: 'bottom' }
        break
      case 'below':
        overlayPosition = { overlayX: notchPosition, overlayY: 'top' }
        break
      case 'before':
        overlayPosition = { overlayX: 'end', overlayY: notchPositionToVertical(notchPosition) }
        break
      case 'after':
        overlayPosition = { overlayX: 'start', overlayY: notchPositionToVertical(notchPosition) }
        break
      default:
        throw Error(`Tooltip position "${position}" is invalid.`)
    }

    const { x, y } = this.invertPosition(overlayPosition.overlayX, overlayPosition.overlayY)

    return {
      main: overlayPosition,
      fallback: { overlayX: x, overlayY: y },
    }
  }

  /** Create the overlay config and position strategy */
  private createOverlay(): OverlayRef {
    if (this.overlayRef) {
      return this.overlayRef
    }

    const scrollableAncestors = this.scrollDispatcher.getAncestorScrollContainers(this.elementRef)

    // Create connected position strategy that listens for scroll events to reposition.
    const strategy = new FlexibleConnectedPositionStrategy2(
      this.elementRef,
      this.viewportRuler,
      this.document,
      this.platform,
      this.overlayContainer,
    )
      .withTransformOriginOn('.sc-ng-tooltip')
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withScrollableContainers(scrollableAncestors)

    strategy.positionChanges.pipe(takeUntil(this.onDestroy)).subscribe((change) => {
      if (this.tooltipInstance) {
        this.tooltipInstance.updatePosition(change, this.position())
        if (change.scrollableViewProperties.isOverlayClipped && this.tooltipInstance.isVisible()) {
          // After position changes occur and the overlay is clipped by
          // a parent scrollable then close the tooltip.
          this.ngZone.run(() => this.hide(0))
        }
      }
    })

    this.overlayRef = this.overlay.create({
      positionStrategy: strategy,
      panelClass: this.#opts.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.reposition({ scrollThrottle: this.#opts.scrollThrottle }),
    })

    this.updatePosition()

    this.overlayRef
      .detachments()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => this.detach())

    return this.overlayRef
  }

  /** Detaches the currently-attached tooltip. */
  private detach() {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach()
    }
    this.tooltipInstance = null
  }

  /** Updates the position of the current tooltip. */
  private updatePosition() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const position: FlexibleConnectedPositionStrategy = <any>this.overlayRef!.getConfig().positionStrategy
    const origin = this.getOrigin()
    const overlay = this.getOverlayPosition()
    position.withPositions([
      { ...origin.main, ...overlay.main },
      { ...origin.fallback, ...overlay.fallback },
    ])
  }

  /** Updates the tooltip message and repositions the overlay according to the new message length */
  private updateTooltipMessage() {
    // Must wait for the message to be painted to the tooltip so that the overlay can properly
    // calculate the correct positioning based on the size of the text.
    if (this.tooltipInstance) {
      this.tooltipInstance.message = this.message()
      this.tooltipInstance.markForCheck()

      this.ngZone.onMicrotaskEmpty
        .asObservable()
        .pipe(take(1), takeUntil(this.onDestroy))
        .subscribe(() => {
          if (this.tooltipInstance && this.overlayRef) {
            this.overlayRef.updatePosition()
          }
        })
    }
  }

  /** Updates the tooltip class */
  private setTooltipClass(tooltipClass: string | string[] | Set<string> | { [key: string]: any }) {
    if (this.tooltipInstance) {
      this.tooltipInstance.tooltipClass = tooltipClass
      this.tooltipInstance.markForCheck()
    }
  }

  /** Inverts an overlay position. */
  private invertPosition(x: HorizontalConnectionPos, y: VerticalConnectionPos) {
    if (this.position() === 'above' || this.position() === 'below') {
      if (y === 'top') {
        y = 'bottom'
      } else if (y === 'bottom') {
        y = 'top'
      }
    } else {
      if (x === 'end') {
        x = 'start'
      } else if (x === 'start') {
        x = 'end'
      }
    }

    return { x, y }
  }
}

function notchPositionToVertical(position: TooltipNotchPosition): VerticalConnectionPos {
  switch (position) {
    case 'start':
      return 'top'
    case 'center':
      return 'center'
    case 'end':
      return 'bottom'
  }
}
