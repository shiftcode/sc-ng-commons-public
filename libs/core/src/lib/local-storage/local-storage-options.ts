import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'

import { ValueOrFactory } from '../logger/helper/value-or-factory.type'
import { LOCAL_STORAGE_OPTIONS } from './local-storage-options.token'

export interface LocalStorageOptions {
  prefix: string
}

/**
 * Provides custom {@link LocalStorageOptions}.
 * Only needed when the default prefix (`${APP_ID}.`) is not suitable.
 *
 * Accepts either the options or a factory function returning them.
 * The factory runs in an injection context, so `inject()` can be used to derive the options.
 */
export function provideLocalStorageOptions(options: ValueOrFactory<LocalStorageOptions>): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: LOCAL_STORAGE_OPTIONS,
      ...(typeof options === 'function' ? { useFactory: options } : { useValue: options }),
    },
  ])
}
