import { Service } from '@angular/core'
import { Observable } from 'rxjs'

import { LocalStorageFallback } from './local-storage-fallback.service'
import { LocalStorageImpl } from './local-storage-impl.service'
import { StorageItemChangeEvent } from './storage-item-change-event.type'

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

/**
 * Prefixed access to the browser's LocalStorage.
 *
 * Provided in root - no setup required.
 * Uses {@link LocalStorageImpl} if the LocalStorage is usable,
 * otherwise falls back to the in-memory {@link LocalStorageFallback}
 * (e.g. on the server or when the user disallows cookies in Safari/Chrome,
 * which makes every LocalStorage access throw).
 */
@Service({
  factory: () => (localStorageSupported() ? new LocalStorageImpl() : new LocalStorageFallback()),
})
export abstract class LocalStorage {
  /**
   * Whether the data is actually stored persistently.
   * Basically whether the browser allows the LS usage.
   */
  abstract readonly persistent: boolean

  abstract observe(key: string): Observable<StorageItemChangeEvent>

  abstract setItem(key: string, value: any): void

  abstract getItem(key: string): unknown

  abstract delete(...keys: string[]): void

  abstract clear(): void

  abstract keys(): string[]
}
