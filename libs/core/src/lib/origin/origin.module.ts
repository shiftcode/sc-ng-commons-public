import { DOCUMENT, isPlatformBrowser } from '@angular/common'
import { NgModule, Optional, PLATFORM_ID } from '@angular/core'
import { ORIGIN } from './origin.token'

export function determinateOrigin(
  platformId: Object, // tslint:disable-line:ban-types
  document?: Document,
): string {
  if (isPlatformBrowser(platformId) && document) {
    return document.location.origin
  }
  throw new Error('make sure this module only applies in browser')
}

@NgModule({
  providers: [
    {
      provide: ORIGIN,
      useFactory: determinateOrigin,
      deps: [PLATFORM_ID, [new Optional(), DOCUMENT]],
    },
  ],
})
export class OriginModule {}
