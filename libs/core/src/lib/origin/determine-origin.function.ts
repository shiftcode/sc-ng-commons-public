import { isPlatformBrowser } from '@angular/common'

/** determine the origin when running on Platform Browser */
export function determineOrigin(platformId: any, document?: Document): string {
  if (isPlatformBrowser(platformId) && document) {
    return document.location.origin.replace(/\/$/, '') // ensure no trailing slash
  }
  throw new Error('make sure this module only applies in browser')
}
