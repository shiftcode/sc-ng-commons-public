import { FactoryProvider, Optional, PLATFORM_ID } from '@angular/core'
import { REQUEST } from '@nguniversal/express-engine/tokens'
import { ORIGIN } from '@shiftcode/ngx-core'
import { determineOrigin } from './determine-origin.function'

/**
 * provides the origin token: when in Lambda use the FINAL_DOMAIN env var otherwise `${request.hostname}:4000`
 */
export const ORIGIN_PROVIDER: FactoryProvider = {
  provide: ORIGIN,
  useFactory: determineOrigin,
  deps: [PLATFORM_ID, [new Optional(), REQUEST]],
}
