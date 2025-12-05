import { Provider } from '@angular/core'

import { LoggerFeatureKind } from './logger-feature-kind.enum'

export interface LoggerFeature {
  kind: LoggerFeatureKind
  providers: Provider[]
}
