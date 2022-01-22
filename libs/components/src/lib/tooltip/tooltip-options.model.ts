import { TooltipPosition } from './tooltip-position.type'

export interface TooltipOptions {
  /** delay before showing the tooltip */
  showDelay: number

  /** delay before hiding the tooltip when not touch */
  hideDelay: number

  /** Time in ms to throttle repositioning after scroll events. */
  scrollThrottle: number

  /** delay before hiding the tooltip when touch */
  touchendHideDelay: number

  /** extra class added to the overlay panel */
  panelClass: string

  /** the position of the tooltip */
  position: TooltipPosition
}

export const defaultTooltipOptions: TooltipOptions = {
  showDelay: 800,
  hideDelay: 50,
  scrollThrottle: 50,
  touchendHideDelay: 1500,
  panelClass: 'sc-tooltip-panel',
  position: 'above',
}
