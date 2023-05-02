import { EnvironmentProviders, makeEnvironmentProviders, Optional, PLATFORM_ID } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { determineOrigin } from './determine-origin.function'
import { ORIGIN } from './origin.token'

/** provide the {@link ORIGIN} token when running on Platform Browser */
export function provideOrigin(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: ORIGIN,
      useFactory: determineOrigin,
      deps: [PLATFORM_ID, [new Optional(), DOCUMENT]],
    },
  ])
}
