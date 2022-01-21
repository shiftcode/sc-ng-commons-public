export type TooltipPosition = TooltipPositionSimple | `${TooltipPositionSimple}-${'start' | 'end'}`

// value of TooltipPosition.split('-')[0]
export type TooltipPositionSimple = 'above' | 'below' | 'before' | 'after'

// value of TooltipPosition.split('-')[1] or center as default
export type TooltipNotchPosition = 'center' | 'start' | 'end'
