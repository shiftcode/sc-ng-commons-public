import { EnvironmentProviders, FactoryProvider, makeEnvironmentProviders, ValueProvider } from '@angular/core'
import { LOG_REQUEST_INFO } from './log-request-info.token'

type LogRequestInfo = Record<string, string | undefined>

export function provideLogRequestInfo(
  logRequestInfoOrFactory: LogRequestInfo | (() => LogRequestInfo),
): EnvironmentProviders {
  if (typeof logRequestInfoOrFactory === 'function') {
    return makeEnvironmentProviders([
      {
        provide: LOG_REQUEST_INFO,
        useFactory: logRequestInfoOrFactory,
      } satisfies FactoryProvider,
    ])
  } else {
    return makeEnvironmentProviders([
      {
        provide: LOG_REQUEST_INFO,
        useValue: logRequestInfoOrFactory,
      } satisfies ValueProvider,
    ])
  }
}
