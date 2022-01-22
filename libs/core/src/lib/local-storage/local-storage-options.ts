import { InjectionToken } from '@angular/core'

export interface LocalStorageOptions {
  prefix: string
}

export const LOCAL_STORAGE_OPTIONS = new InjectionToken<LocalStorageOptions>('LOCAL_STORAGE_OPTIONS')
