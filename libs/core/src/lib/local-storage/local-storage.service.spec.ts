import { ClassProvider, ValueProvider } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { firstValueFrom, scan, shareReplay } from 'rxjs'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { MockStorage } from '../../../test'
import { WindowRef } from '../window/window-ref.service'
import { LocalStorage } from './local-storage.service'
import { LocalStorageImpl } from './local-storage-impl.service'
import { LOCAL_STORAGE_OPTIONS, LocalStorageOptions } from './local-storage-options'

const prefix: LocalStorageOptions['prefix'] = 'TEST_'

function configureTestBed(options: LocalStorageOptions = { prefix }) {
  class MockWindowRef {
    readonly nativeWindow = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      localStorage: new MockStorage(),
    }
  }

  const windowRefMockProvider: ClassProvider = {
    provide: WindowRef,
    useClass: MockWindowRef,
  }
  const optionsProvider: ValueProvider = {
    provide: LOCAL_STORAGE_OPTIONS,
    useValue: options,
  }
  TestBed.configureTestingModule({
    providers: [windowRefMockProvider, optionsProvider, { provide: LocalStorage, useClass: LocalStorageImpl }],
  })
}

describe('LocalStorage', () => {
  let storage: MockStorage
  let lsFnSpy: ReturnType<typeof vi.spyOn>
  let service: LocalStorage

  describe('observe', () => {
    let win: WindowRef
    let winSpy: ReturnType<typeof vi.spyOn>
    beforeEach(() => {
      configureTestBed()
      win = TestBed.inject(WindowRef)
      winSpy = vi.spyOn(win.nativeWindow!, 'addEventListener')
      storage = win.nativeWindow!.localStorage
      service = TestBed.inject(LocalStorage)
    })
    it('only emits events of provided key with configured prefix', async () => {
      expect(winSpy).toHaveBeenCalledTimes(0) // since its a cold observable

      const key = 'ThisIsMyKey'

      const values = service.observe(key).pipe(
        scan((acc, curr) => [...acc, curr], <any[]>[]),
        shareReplay(1),
      )
      const s1 = values.subscribe()
      expect(winSpy).toHaveBeenCalledTimes(1)
      const rxLstnr: (ev: StorageEvent) => void = winSpy.mock.calls[0][1]
      expect(typeof rxLstnr).toBe('function')
      rxLstnr(new StorageEvent('storage', { key: `${prefix}${key}`, oldValue: null, newValue: 'true' }))
      rxLstnr(new StorageEvent('storage', { key: `notMine`, oldValue: null, newValue: 'false' }))

      expect(await firstValueFrom(values)).toEqual([{ key, oldValue: null, newValue: true }])
      s1.unsubscribe()
    })
  })

  describe('setItem', () => {
    beforeEach(() => {
      configureTestBed()
      storage = TestBed.inject(WindowRef).nativeWindow!.localStorage
      lsFnSpy = vi.spyOn(storage, 'setItem')
      service = TestBed.inject(LocalStorage)
    })

    it('writes item by key with configured prefix', () => {
      service.setItem('key', true)
      expect(lsFnSpy).toHaveBeenCalledTimes(1)
      expect(lsFnSpy).toHaveBeenCalledWith(`${prefix}key`, 'true')
    })
    it('stringifies value before storing', () => {
      const value = { a: true, b: 'ok' }
      service.setItem('key', value)
      expect(lsFnSpy).toHaveBeenCalledWith(`${prefix}key`, JSON.stringify(value))
    })
    it('sets null when undefined', () => {
      service.setItem('key', undefined)
      expect(lsFnSpy).toHaveBeenCalledWith(`${prefix}key`, JSON.stringify(null))
    })
    it('throws when no stringifyable value', () => {
      const x: any = { value: true }
      x.x = x
      expect(() => service.setItem('x', x)).toThrow(TypeError)
    })
  })

  describe('getItem', () => {
    beforeEach(() => {
      configureTestBed()
      storage = TestBed.inject(WindowRef).nativeWindow!.localStorage
      lsFnSpy = vi.spyOn(storage, 'getItem')
      service = TestBed.inject(LocalStorage)
    })

    it('returns item by key with configured prefix', () => {
      service.getItem('key')
      expect(lsFnSpy).toHaveBeenCalledTimes(1)
      expect(lsFnSpy).toHaveBeenCalledWith(`${prefix}key`)
    })
    it('parses value before returning', () => {
      const value = { ok: true, values: [] }
      lsFnSpy.mockReturnValue(JSON.stringify(value))
      expect(service.getItem('key')).toEqual(value)
    })
    it('returns null when not parsable', () => {
      lsFnSpy.mockReturnValue('this value is not parsable')
      expect(service.getItem('key')).toEqual(null)
    })
  })

  describe('delete', () => {
    beforeEach(() => {
      configureTestBed()
      storage = TestBed.inject(WindowRef).nativeWindow!.localStorage
      lsFnSpy = vi.spyOn(storage, 'removeItem')
      service = TestBed.inject(LocalStorage)
    })
    it('removes item by key with configured prefix', () => {
      service.delete('key')
      expect(lsFnSpy).toHaveBeenCalledWith(`${prefix}key`)
    })
    it('removes multiple items by keys with configured prefix', () => {
      const keys = ['a', 'b', 'c', 'd']
      service.delete(...keys)
      expect(lsFnSpy).toHaveBeenCalledTimes(keys.length)
      for (let i = 0; i < keys.length; i++) {
        expect(lsFnSpy).toHaveBeenNthCalledWith(i + 1, `${prefix}${keys[i]}`)
      }
    })
  })

  describe('clear', () => {
    let lsClearSpy: ReturnType<typeof vi.spyOn>
    beforeEach(() => {
      configureTestBed()
      storage = TestBed.inject(WindowRef).nativeWindow!.localStorage
      lsFnSpy = vi.spyOn(storage, 'removeItem')
      lsClearSpy = vi.spyOn(storage, 'clear')
      service = TestBed.inject(LocalStorage)
    })
    it('does not use clear', () => {
      service.clear()
      expect(lsClearSpy).not.toHaveBeenCalled()
    })
    it('clears all keys starting with configured prefix', () => {
      storage.setItem('keep_a', 'a')
      storage.setItem(`${prefix}_a`, 'a')
      storage.setItem(`${prefix}_b`, 'a')
      storage.setItem(`${prefix}_c`, 'a')
      storage.setItem(`keep_b`, 'b')
      service.clear()
      expect(lsFnSpy).toHaveBeenCalledTimes(3)
      expect(storage).toHaveProperty('keep_a', 'a')
      expect(storage).toHaveProperty('keep_b', 'b')
    })
  })

  describe('keys', () => {
    beforeEach(() => {
      configureTestBed()
      storage = TestBed.inject(WindowRef).nativeWindow!.localStorage
      service = TestBed.inject(LocalStorage)
    })
    it('returns all keys starting with configured prefix but removes prefix', () => {
      const keys: string[] = ['a', 'b', 'c']
      const prefixedKeys = keys.map((k) => `${prefix}${k}`)
      storage.setItem('other_a', 'not-my-key')
      for (const k of prefixedKeys) {
        storage.setItem(k, '"one-of-my-keys"')
      }
      storage.setItem('other_b', 'not-my-key')

      expect(service.keys()).toEqual(keys)
    })
  })
})
