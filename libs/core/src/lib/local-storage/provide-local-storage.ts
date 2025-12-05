import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'

import { LocalStorage } from './local-storage.service'
import { LocalStorageFallback } from './local-storage-fallback.service'
import { LocalStorageImpl } from './local-storage-impl.service'
import { LOCAL_STORAGE_OPTIONS, LocalStorageOptions } from './local-storage-options'

function localStorageSupported(): boolean {
  try {
    const ls = globalThis.localStorage
    const x = '__storage_test__'
    ls.setItem(x, x)
    ls.removeItem(x)
    return true
  } catch {
    return false
  }
}

export function provideLocalStorage(options: LocalStorageOptions): EnvironmentProviders {
  // in safari and chrome cookies can be disallowed.
  //   This option also affects the localstorage: when trying to set or get from the LS it will throw
  const support = localStorageSupported()

  return makeEnvironmentProviders([
    { provide: LOCAL_STORAGE_OPTIONS, useValue: options },
    { provide: LocalStorage, useClass: support ? LocalStorageImpl : LocalStorageFallback },
  ])
}
