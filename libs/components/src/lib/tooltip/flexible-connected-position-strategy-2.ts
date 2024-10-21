import { coerceCssPixelValue } from '@angular/cdk/coercion'
import { ConnectedPosition, FlexibleConnectedPositionStrategy } from '@angular/cdk/overlay'
import { ViewportScrollPosition } from '@angular/cdk/scrolling'

/** A simple (x, y) coordinate. */
interface Point {
  x: number
  y: number
}

/** Record of measurements for how an overlay (at a given position) fits into the viewport. */
interface OverlayFit {
  /** Whether the overlay fits completely in the viewport. */
  isCompletelyWithinViewport: boolean

  /** Whether the overlay fits in the viewport on the y-axis. */
  fitsInViewportVertically: boolean

  /** Whether the overlay fits in the viewport on the x-axis. */
  fitsInViewportHorizontally: boolean

  /** The total visible area (in px^2) of the overlay inside the viewport. */
  visibleArea: number
}

/** Equivalent of `ClientRect` without some of the properties we don't care about. */
type Dimensions = Omit<DOMRect, 'x' | 'y' | 'toJSON'>

export class FlexibleConnectedPositionStrategy2 extends FlexibleConnectedPositionStrategy {}

/** Narrows the given viewport rect by the current _viewportMargin. */
FlexibleConnectedPositionStrategy2.prototype['_getNarrowedViewportRect'] =
  function _getNarrowedViewportRect(): Dimensions {
    // the problem: the viewport changes on mobile browsers depending the scroll direction
    // window innerHeight/innerWidth correctly handles this changes but does not consider scrollbars
    // documentElement clientHeight/clientWidth correctly handles the scrollbars but not the viewport changes
    // therefore we use `clientWidth` for the width and `innerHeight` for the height
    // this works for use because we never have horizontal scrollbars

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Accessing private member '_viewportMargin'
    const viewportMargin = this._viewportMargin

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Accessing private member '_document'
    const docEl = this._document.documentElement

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Accessing private member '._viewportRuler'
    const scrollPosition = this._viewportRuler.getViewportScrollPosition()

    const width = docEl.clientWidth
    const height = window?.innerHeight ?? docEl.clientHeight

    return {
      top: scrollPosition.top + viewportMargin,
      left: scrollPosition.left + viewportMargin,
      right: scrollPosition.left + width - viewportMargin,
      bottom: scrollPosition.top + height - viewportMargin,
      width: width - 2 * viewportMargin,
      height: height - 2 * viewportMargin,
    }
  }

/** Gets how well an overlay at the given point will fit within the viewport. */
FlexibleConnectedPositionStrategy2.prototype['_getOverlayFit'] = function _getOverlayFit(
  point: Point,
  rawOverlayRect: Dimensions,
  viewport: Dimensions,
  position: ConnectedPosition,
): OverlayFit {
  // Round the overlay rect when comparing against the
  // viewport, because the viewport is always rounded.
  const overlay = getRoundedBoundingClientRect(rawOverlayRect)
  let { x, y } = point

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Accessing private member '_getOffset'
  const offsetX = this._getOffset(position, 'x')

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Accessing private member '_getOffset'
  const offsetY = this._getOffset(position, 'y')
  // Account for the offsets since they could push the overlay out of the viewport.
  if (offsetX) {
    x += offsetX
  }
  if (offsetY) {
    y += offsetY
  }
  // How much the overlay would overflow at this position, on each side.
  const leftOverflow = 0 - x
  const rightOverflow = x + overlay.width - viewport.width
  const topOverflow = 0 - y
  const bottomOverflow = y + overlay.height - viewport.height
  // Visible parts of the element on each axis.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Accessing private member '_subtractOverflows'
  const visibleWidth = this._subtractOverflows(overlay.width, leftOverflow, rightOverflow)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Accessing private member '_subtractOverflows'
  const visibleHeight = this._subtractOverflows(overlay.height, topOverflow, bottomOverflow)
  const visibleArea =
    visibleWidth < 0 && visibleHeight < 0
      ? Number.MIN_SAFE_INTEGER
      : visibleWidth < 0 || visibleHeight < 0
        ? Number.MIN_SAFE_INTEGER + Math.abs(visibleWidth * visibleHeight)
        : visibleWidth * visibleHeight

  return {
    visibleArea,
    isCompletelyWithinViewport: overlay.width * overlay.height === visibleArea,
    fitsInViewportVertically: visibleHeight === overlay.height,
    fitsInViewportHorizontally: visibleWidth === overlay.width,
  }
}

/** Gets the exact top/bottom for the overlay when not using flexible sizing or when pushing. */
FlexibleConnectedPositionStrategy2.prototype['_getExactOverlayY'] = function _getExactOverlayY(
  position: ConnectedPosition,
  originPoint: Point,
  scrollPosition: ViewportScrollPosition,
) {
  // Reset any existing styles. This is necessary in case the
  // preferred position has changed since the last `apply`.
  const styles = { top: '', bottom: '' } as CSSStyleDeclaration
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Accessing private member '_overlayRect' '_getOverlayPoint'
  let overlayPoint = this._getOverlayPoint(originPoint, this._overlayRect, position)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Accessing private member '_isPushed'
  if (this._isPushed) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Accessing private member '_overlayRect', '._pushOverlayOnScreen'
    overlayPoint = this._pushOverlayOnScreen(overlayPoint, this._overlayRect, scrollPosition)
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Accessing private member '_overlayContainer'
  const virtualKeyboardOffset = this._overlayContainer.getContainerElement().getBoundingClientRect().top

  // Normally this would be zero, however when the overlay is attached to an input (e.g. in an
  // autocomplete), mobile browsers will shift everything in order to put the input in the middle
  // of the screen and to make space for the virtual keyboard. We need to account for this offset,
  // otherwise our positioning will be thrown off.
  overlayPoint.y -= virtualKeyboardOffset

  // We want to set either `top` or `bottom` based on whether the overlay wants to appear
  // above or below the origin and the direction in which the element will expand.
  if (position.overlayY === 'bottom') {
    // When using `bottom`, we adjust the y position such that it is the distance
    // from the bottom of the viewport rather than the top.

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Accessing private member '_document'
    const docEl = this._document.documentElement

    // THIS IS OUR FIX HERE: innerHeight instead of clientHeight
    const documentHeight = window?.innerHeight ?? docEl.clientHeight

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Accessing private member '_overlayRect'
    styles.bottom = `${documentHeight - (overlayPoint.y + this._overlayRect.height)}px`
  } else {
    styles.top = coerceCssPixelValue(overlayPoint.y)
  }

  return styles
}

/**
 * Gets a version of an element's bounding `ClientRect` where all the values are rounded down to
 * the nearest pixel. This allows us to account for the cases where there may be sub-pixel
 * deviations in the `ClientRect` returned by the browser (e.g. when zoomed in with a percentage
 * size, see #21350).
 */
function getRoundedBoundingClientRect(dimensions: Dimensions): Dimensions {
  return {
    top: Math.floor(dimensions.top),
    right: Math.floor(dimensions.right),
    bottom: Math.floor(dimensions.bottom),
    left: Math.floor(dimensions.left),
    width: Math.floor(dimensions.width),
    height: Math.floor(dimensions.height),
  }
}
