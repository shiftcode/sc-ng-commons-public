import { Observable } from 'rxjs'
import { StorageItemChangeEvent } from './storage-item-change-event.type'

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
