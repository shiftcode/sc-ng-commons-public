import { APP_ID, inject, InjectionToken } from '@angular/core'

import { LocalStorageOptions } from './local-storage-options'

/**
 * Internal token - not part of the public API.
 * Use {@link provideLocalStorageOptions} to provide custom options.
 */
export const LOCAL_STORAGE_OPTIONS = new InjectionToken<LocalStorageOptions>('LOCAL_STORAGE_OPTIONS', {
  providedIn: 'root',
  factory: () => {
    return {
      prefix: `${inject(APP_ID)}.`,
    }
  },
})
