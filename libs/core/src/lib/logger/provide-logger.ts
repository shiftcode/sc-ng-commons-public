import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core'

/** @internal */
export enum LoggerFeatureKind {
  TRANSPORT,
}

export interface LoggerFeature {
  kind: LoggerFeatureKind
  providers: Provider[]
}

export function provideLogger(...features: LoggerFeature[]): EnvironmentProviders {
  return makeEnvironmentProviders([features.map((feature) => feature.providers)])
}
