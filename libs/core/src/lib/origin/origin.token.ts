import { DOCUMENT } from '@angular/common'
import { inject, InjectionToken } from '@angular/core'

/** token which provides the current location origin */
export const ORIGIN = new InjectionToken<string>(ngDevMode ? 'ORIGIN' : '', {
  factory: () => inject(DOCUMENT).location.origin,
})
