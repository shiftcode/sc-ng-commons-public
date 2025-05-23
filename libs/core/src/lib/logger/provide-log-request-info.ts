import { EnvironmentProviders, FactoryProvider, makeEnvironmentProviders, ValueProvider } from '@angular/core'
import { LOG_REQUEST_INFO } from '@shiftcode/ngx-core'

export function provideLogRequestInfo(
  logRequestInfoOrFactory: Record<string, string> | (() => Record<string, string>),
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
