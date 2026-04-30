import { Type } from '@angular/core'
import { LogTransport } from '@shiftcode/logger'

import { LoggerFeature } from './logger-feature.type'
import { LoggerFeatureKind } from './logger-feature-kind.enum'

/**
 * LoggerFeature to use with {@link provideLogger} that registers a custom LogTransport implementation.
 * @param transportClass - The LogTransport implementation class to use
 * @param useExisting - If true, the transportClass will be registered with `useExisting` instead of `useClass`.
 */
export function withCustomLogTransport(transportClass: Type<LogTransport>, useExisting = false): LoggerFeature {
  return {
    kind: LoggerFeatureKind.TRANSPORT,
    providers: [
      {
        provide: LogTransport,
        multi: true,
        ...(useExisting ? { useExisting: transportClass } : { useClass: transportClass }),
      },
    ],
  }
}
