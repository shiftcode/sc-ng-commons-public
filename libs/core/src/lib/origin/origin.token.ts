import { inject, InjectionToken, DOCUMENT } from '@angular/core'

/** token which provides the current location origin */
export const ORIGIN = new InjectionToken<string>(ngDevMode ? 'ORIGIN' : '', {
  factory: () => inject(DOCUMENT).location.origin,
})
