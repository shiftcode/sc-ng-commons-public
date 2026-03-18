import { ErrorHandler, StaticProvider } from '@angular/core'

import { LoggerErrorHandler } from './logger-error-handler'
import { LoggerFeature } from './logger-feature.type'
import { LoggerFeatureKind } from './logger-feature-kind.enum'

/**
 * LoggerFeature feature to use with {@link provideLogger} that registers the global Angular {@link ErrorHandler} to log uncaught Errors with the LoggerService
 * @hint manually provide {@link provideBrowserGlobalErrorListeners } to also receive global uncaught Errors from the browser.
 */
export function withErrorHandler(): LoggerFeature {
  return {
    kind: LoggerFeatureKind.GLOBAL_ERROR_HANDLER,
    providers: [
      {
        provide: ErrorHandler,
        useClass: LoggerErrorHandler,
      } satisfies StaticProvider,
    ],
  }
}
