import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'

import { LoggerFeature } from './logger-feature.type'

export function provideLogger(...features: LoggerFeature[]): EnvironmentProviders {
  return makeEnvironmentProviders([features.map((feature) => feature.providers)])
}
