import { AriaDescriber, FocusMonitor } from '@angular/cdk/a11y'
import { coerceBooleanProperty } from '@angular/cdk/coercion'
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
import { DOCUMENT } from '@angular/common'
import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  ViewContainerRef,
} from '@angular/core'
import { Subject } from 'rxjs'
import { take, takeUntil } from 'rxjs/operators'
import { FlexibleConnectedPositionStrategy2 } from './flexible-connected-position-strategy-2'
import { TOOLTIP_DEFAULT_OPTIONS } from './tooltip-default-options.token'
import { defaultTooltipOptions, TooltipOptions } from './tooltip-options.model'
import { TooltipNotchPosition, TooltipPosition, TooltipPositionSimple } from './tooltip-position.type'
import { TooltipComponent } from './tooltip.component'

/**
 * Tooltip directive which will trigger the tooltip.
 * see {@link TooltipComponent} for customization.
 */
@Directive({
  selector: '[scTooltip]',
  exportAs: 'scTooltip',
  standalone: true,
})
export class TooltipDirective implements OnDestroy, OnInit {
  /** Allows the user to define the position of the tooltip relative to the parent element */
  @Input('scTooltipPosition')
  get position(): TooltipPosition {
    return this._position ?? this.opts.position
  }

  set position(value: TooltipPosition) {
    if (value !== this._position) {
      this._position = value

      if (this.tooltipInstance) {
        this.tooltipInstance.position = this._position
      }

      if (this.overlayRef) {
        this.updatePosition()
        if (this.tooltipInstance) {
          this.tooltipInstance.show(0)
        }
        this.overlayRef.updatePosition()
      }
    }
  }

  /** Disables the display of the tooltip. */
  @Input('scTooltipDisabled')
  get disabled(): boolean {
    return this._disabled
  }

  set disabled(value: boolean | string) {
    this._disabled = coerceBooleanProperty(value)
    if (this._disabled) {
      // If tooltip is disabled, hide immediately.
      this.hide(0)
    }
  }

  /** The message to be displayed in the tooltip */
  @Input('scTooltip')
  get message() {
    return this._message
  }

  set message(value: string) {
    this.ariaDescriber.removeDescription(this.elementRef.nativeElement, this._message)

    // If the message is not a string (e.g. number), convert it to a string and trim it.
    // eslint-disable-next-line eqeqeq
    this._message = value != null ? `${value}`.trim() : ''

    if (!this._message && this.isTooltipVisible()) {
      this.hide(0)
    } else {
      this.updateTooltipMessage()
      this.ariaDescriber.describe(this.elementRef.nativeElement, this.message)
    }
  }

  /** Classes to be passed to the tooltip. Supports the same syntax as `ngClass`. */
  @Input('scTooltipClass')
  get tooltipClass() {
    return this._tooltipClass
  }

  set tooltipClass(value: string | string[] | Set<string> | { [key: string]: any }) {
    this._tooltipClass = value
    if (this.tooltipInstance) {
      this.setTooltipClass(this._tooltipClass)
    }
  }

  /** The default delay in ms before showing the tooltip after show is called */
  @Input('scTooltipShowDelay')
  showDelay: number

  /** The default delay in ms before hiding the tooltip after hide is called */
  @Input('scTooltipHideDelay')
  hideDelay: number

  private _position?: TooltipPosition
  private _disabled = false
  private _tooltipClass: string | string[] | Set<string> | { [key: string]: any }
  private _message = ''
  private overlayRef: OverlayRef | null
  private tooltipInstance: TooltipComponent | null
  private portal: ComponentPortal<TooltipComponent>
  private readonly manualHostElementListeners = new Map<string, EventListenerOrEventListenerObject>()
  private readonly onDestroy = new Subject<void>()
  private readonly opts: TooltipOptions

  constructor(
    private overlay: Overlay,
    private viewportRuler: ViewportRuler,
    private elementRef: ElementRef<HTMLElement>,
    private scrollDispatcher: ScrollDispatcher,
    private viewContainerRef: ViewContainerRef,
    private ngZone: NgZone,
    private ariaDescriber: AriaDescriber,
    private focusMonitor: FocusMonitor,
    private platform: Platform,
    private overlayContainer: OverlayContainer,
    @Inject(DOCUMENT) private document: Document,
    @Optional() @Inject(TOOLTIP_DEFAULT_OPTIONS) opts: TooltipOptions | null,
  ) {
    this.opts = { ...defaultTooltipOptions, ...opts }

    this.manualHostElementListeners
      .set('touchstart', () => this.show())
      .set('touchend', () => this.hide(this.opts.touchendHideDelay))

    // The mouse events shouldn't be bound on mobile devices, because they can prevent the
    // first tap from firing its click event or can cause the tooltip to open for clicks.
    if (!platform.IOS && !platform.ANDROID) {
      this.manualHostElementListeners.set('mouseenter', () => this.show()).set('mouseleave', () => this.hide())
    }
    // we register them all as passive, as we will never call `preventDefault` on them
    //  basically `passive` would only be needed for `touch*` events
    this.manualHostElementListeners.forEach((listener, event) => {
      elementRef.nativeElement.addEventListener(event, listener, { passive: true })
    })

    focusMonitor
      .monitor(elementRef)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((origin) => {
        // Note that the focus monitor runs outside the Angular zone.
        if (!origin) {
          ngZone.run(() => this.hide(0))
        } else if (origin === 'keyboard') {
          ngZone.run(() => this.show())
        }
      })
  }

  /**
   * Setup styling-specific things
   */
  ngOnInit() {
    const element = this.elementRef.nativeElement
    const elementStyle: CSSStyleDeclaration & { webkitUserDrag: string; msUserSelect: string } = <any>element.style

    if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
      // When we bind a gesture event on an element (in this case `longpress`), HammerJS
      // will add some inline styles by default, including `user-select: none`. This is
      // problematic on iOS and in Safari, because it will prevent users from typing in inputs.
      // Since `user-select: none` is not needed for the `longpress` event and can cause unexpected
      // behavior for text fields, we always clear the `user-select` to avoid such issues.
      elementStyle.webkitUserSelect = elementStyle.userSelect = elementStyle.msUserSelect = ''
    }

    // Hammer applies `-webkit-user-drag: none` on all elements by default,
    // which breaks the native drag&drop. If the consumer explicitly made
    // the element draggable, clear the `-webkit-user-drag`.
    if (element.draggable && elementStyle.webkitUserDrag === 'none') {
      elementStyle.webkitUserDrag = ''
    }
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

    this.ariaDescriber.removeDescription(this.elementRef.nativeElement, this.message)
    this.focusMonitor.stopMonitoring(this.elementRef)
  }

  /** Shows the tooltip after the delay in ms, defaults to tooltip-delay-show or 0ms if no input */
  show(delay?: number): void {
    delay = delay ?? this.showDelay ?? this.opts.showDelay
    if (
      this.disabled ||
      !this.message ||
      (this.isTooltipVisible() && !this.tooltipInstance?.showTimeoutId && !this.tooltipInstance?.hideTimeoutId)
    ) {
      return
    }

    const overlayRef = this.createOverlay()

    this.detach()
    this.portal = this.portal || new ComponentPortal(TooltipComponent, this.viewContainerRef)
    this.tooltipInstance = overlayRef.attach(this.portal).instance
    this.tooltipInstance.position = this.position
    this.tooltipInstance
      .afterHidden()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => this.detach())

    this.setTooltipClass(this._tooltipClass)

    this.updateTooltipMessage()

    this.tooltipInstance.show(delay)
  }

  /** Hides the tooltip after the delay in ms, defaults to tooltip-delay-hide or 0ms if no input */
  hide(delay?: number): void {
    delay = delay ?? this.hideDelay ?? this.opts.hideDelay
    if (this.tooltipInstance) {
      this.tooltipInstance.hide(delay)
    }
  }

  /** Shows/hides the tooltip */
  toggle(): void {
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
    const position = this.position
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
    const position = this.position
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
        this.tooltipInstance.updatePosition(change, this.position)
        if (change.scrollableViewProperties.isOverlayClipped && this.tooltipInstance.isVisible()) {
          // After position changes occur and the overlay is clipped by
          // a parent scrollable then close the tooltip.
          this.ngZone.run(() => this.hide(0))
        }
      }
    })

    this.overlayRef = this.overlay.create({
      positionStrategy: strategy,
      panelClass: this.opts.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.reposition({ scrollThrottle: this.opts.scrollThrottle }),
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
    const position: FlexibleConnectedPositionStrategy = <any>this.overlayRef?.getConfig().positionStrategy
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
      this.tooltipInstance.message = this.message
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
    if (this.position === 'above' || this.position === 'below') {
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
