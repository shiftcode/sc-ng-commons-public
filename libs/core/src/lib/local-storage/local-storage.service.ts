import { Inject, Injectable } from '@angular/core'
import { fromEvent, NEVER, Observable, share } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { WindowRef } from '../window/window-ref.service'
import { LOCAL_STORAGE_OPTIONS, LocalStorageOptions } from './local-storage-options'
import { StorageItemChangeEvent } from './storage-item-change-event.type'

const STORAGE_EVENT_NAME = 'storage'

@Injectable({ providedIn: 'root' })
export class LocalStorage {
  /**
   * Emits event values from the `storage` event of the {@link Window}
   * Note: This won't work on the same page that is making the changes
   * — it is really a way for other pages on the domain using the storage to sync any changes that are made.
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event}
   */
  readonly events$: Observable<StorageItemChangeEvent>

  private readonly win: Window | null
  private readonly storage: Storage | null
  private readonly prefix: string

  constructor(windowRef: WindowRef, @Inject(LOCAL_STORAGE_OPTIONS) options: LocalStorageOptions) {
    // hint: don't use LoggerService.
    // otherwise we'll have circular deps in apps when using
    // Logger <- CloudWatchLogTransport <- CloudWatchService <- ClientId <- LocalStorage <- Logger

    this.win = windowRef.nativeWindow
    this.storage = windowRef.nativeWindow?.localStorage ?? null
    this.prefix = options.prefix

    this.events$ = this.win
      ? fromEvent<StorageEvent>(this.win, STORAGE_EVENT_NAME).pipe(
          filter((ev): ev is StorageEvent & { key: string } => !!ev.key?.startsWith(this.prefix)),
          map(this.prepareEvent),
          share(),
        )
      : NEVER
  }

  /**
   * emits event when value for key changed based on the `storage` event of the {@link Window}
   *  Note: This won't work on the same page that is making the changes
   * — it is really a way for other pages on the domain using the storage to sync any changes that are made.
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event}
   */
  observe(key: string): Observable<StorageItemChangeEvent> {
    return this.events$.pipe(filter((ev) => ev.key === key))
  }

  setItem(key: string, value: any): void {
    if (value === undefined) {
      value = null
    }
    this.storage?.setItem(this._prefixKey(key), JSON.stringify(value))
  }

  getItem(key: string): unknown {
    return this._parseValue(this.storage?.getItem(this._prefixKey(key)))
  }

  delete(...keys: string[]): void {
    keys.forEach((key) => this.storage?.removeItem(this._prefixKey(key)))
  }

  clear() {
    if (this.storage) {
      for (const key in this.storage) {
        if (key.startsWith(this.prefix)) {
          this.storage.removeItem(key)
        }
      }
    }
  }

  keys(): string[] {
    const keys: string[] = []
    if (this.storage) {
      const prefixLength: number = this.prefix.length
      for (const key in this.storage) {
        if (key.startsWith(this.prefix)) {
          keys.push(key.substr(prefixLength))
        }
      }
    }
    return keys
  }

  private _prefixKey(key: string): string {
    return this.prefix + key
  }

  private _unPrefixKey(key: string): string {
    return key.substr(this.prefix.length)
  }

  private _parseValue(val: string | null | undefined): unknown {
    if (val === undefined || val === null) {
      return null
    }
    try {
      return JSON.parse(val)
    } catch (err: unknown) {
      return null
    }
  }

  private readonly prepareEvent = (ev: StorageEvent & { key: string }): StorageItemChangeEvent => {
    const key = this._unPrefixKey(ev.key)
    return {
      key,
      oldValue: this._parseValue(ev.oldValue),
      newValue: this._parseValue(ev.newValue),
    }
  }
}
