import { NEVER, Observable } from 'rxjs'
import { LocalStorage } from './local-storage.service'
import { StorageItemChangeEvent } from './storage-item-change-event.type'

export class LocalStorageFallback implements LocalStorage {
  readonly persistent = false
  private readonly ls = new Map<string, any>()

  clear(): void {
    this.ls.clear()
  }

  delete(...keys: string[]): void {
    keys.forEach((key) => this.ls.delete(key))
  }

  getItem(key: string): unknown {
    return this.ls.get(key)
  }

  keys(): string[] {
    return Array.from(this.ls.keys())
  }

  observe(key: string): Observable<StorageItemChangeEvent> {
    return NEVER
  }

  setItem(key: string, value: any): void {
    this.ls.set(key, value)
  }
}
