import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'
import { ORIGIN } from '@shiftcode/ngx-core'
import { determineOrigin } from './determine-origin.function'

/**
 * provides the {@link ORIGIN} when running on platform server.
 * options default: { envVarName: 'FINAL_DOMAIN' }
 */
export function provideOrigin(options: { envVarName: string } = { envVarName: 'FINAL_DOMAIN' }): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: ORIGIN,
      useFactory: determineOrigin.bind(void 0, options.envVarName),
    },
  ])
}
