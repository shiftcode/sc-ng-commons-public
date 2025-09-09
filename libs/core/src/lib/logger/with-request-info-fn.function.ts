import { LogRequestInfoFn } from './log-request-info-fn.type'
import { LOG_REQUEST_INFO_FN } from './log-request-info-fn.token'
import { FactoryProvider } from '@angular/core'
import { LoggerFeatureKind } from './logger-feature-kind.enum'
import { LoggerFeature } from './logger-feature.type'

/**
 * LoggerFeature feature to use with {@link provideLogger}
 * @hint only works with {@link withRemoteTransport} and {@link withCloudwatchTransport}
 */
export function withRequestInfoFn(logRequestInfoFnFactory: () => LogRequestInfoFn): LoggerFeature {
  return {
    kind: LoggerFeatureKind.REQUEST_INFO_FN,
    providers: [
      {
        provide: LOG_REQUEST_INFO_FN,
        useFactory: logRequestInfoFnFactory,
      } satisfies FactoryProvider,
    ],
  }
}
