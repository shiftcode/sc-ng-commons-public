import { Type } from '@angular/core'
import { LogTransport } from '@shiftcode/logger'

import { LoggerFeature } from './logger-feature.type'
import { LoggerFeatureKind } from './logger-feature-kind.enum'

/**
 * LoggerFeature to use with {@link provideLogger} that registers a custom LogTransport implementation.
 * @param transportClass - The LogTransport implementation class to use
 */
export function withCustomLogTransport(transportClass: Type<LogTransport>): LoggerFeature {
  return {
    kind: LoggerFeatureKind.TRANSPORT,
    providers: [{ provide: LogTransport, useClass: transportClass, multi: true }],
  }
}
