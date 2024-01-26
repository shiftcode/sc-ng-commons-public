import { FactoryProvider, Optional, PLATFORM_ID } from '@angular/core'
import { ORIGIN } from '@shiftcode/ngx-core'
import { determineOrigin } from './determine-origin.function'
import { REQUEST } from './request.injection-token'

/**
 * provides the origin token: when in Lambda use the FINAL_DOMAIN env var otherwise `${request.hostname}:4000`
 * @deprecated use {@link provideOrigin} instead
 */
export const ORIGIN_PROVIDER: FactoryProvider = {
  provide: ORIGIN,
  useFactory: determineOrigin,
  deps: [PLATFORM_ID, [new Optional(), REQUEST]],
}
