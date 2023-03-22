import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'
import { LocalStorageOptions, LOCAL_STORAGE_OPTIONS } from './local-storage-options'

export function provideLocalStorage(options: LocalStorageOptions): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: LOCAL_STORAGE_OPTIONS, useValue: options }])
}
