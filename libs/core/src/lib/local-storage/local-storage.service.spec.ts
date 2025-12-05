import { ClassProvider, ValueProvider } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { firstValueFrom, scan, shareReplay } from 'rxjs'

import { MockStorage } from '../../../test'
import { WindowRef } from '../window/window-ref.service'
import { LocalStorage } from './local-storage.service'
import { LocalStorageImpl } from './local-storage-impl.service'
import { LOCAL_STORAGE_OPTIONS, LocalStorageOptions } from './local-storage-options'

const prefix: LocalStorageOptions['prefix'] = 'TEST_'

function configureTestBed(options: LocalStorageOptions = { prefix }) {
  class MockWindowRef {
    readonly nativeWindow = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
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
  let lsFnSpy: jest.SpyInstance<any, any>
  let service: LocalStorage

  describe('observe', () => {
    let win: WindowRef
    let winSpy: jest.SpyInstance<any, any>
    beforeEach(() => {
      configureTestBed()
      win = TestBed.inject(WindowRef)
      winSpy = jest.spyOn(win.nativeWindow!, 'addEventListener')
      storage = win.nativeWindow!.localStorage
      service = TestBed.inject(LocalStorage)
    })
    test('only emits events of provided key with configured prefix', async () => {
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
      lsFnSpy = jest.spyOn(storage, 'setItem')
      service = TestBed.inject(LocalStorage)
    })

    test('writes item by key with configured prefix', () => {
      service.setItem('key', true)
      expect(lsFnSpy).toHaveBeenCalledTimes(1)
      expect(lsFnSpy).toHaveBeenCalledWith(`${prefix}key`, 'true')
    })
    test('stringifies value before storing', () => {
      const value = { a: true, b: 'ok' }
      service.setItem('key', value)
      expect(lsFnSpy).toHaveBeenCalledWith(`${prefix}key`, JSON.stringify(value))
    })
    test('sets null when undefined', () => {
      service.setItem('key', undefined)
      expect(lsFnSpy).toHaveBeenCalledWith(`${prefix}key`, JSON.stringify(null))
    })
    test('throws when no stringifyable value', () => {
      const x: any = { value: true }
      x.x = x
      expect(() => service.setItem('x', x)).toThrow(TypeError)
    })
  })

  describe('getItem', () => {
    beforeEach(() => {
      configureTestBed()
      storage = TestBed.inject(WindowRef).nativeWindow!.localStorage
      lsFnSpy = jest.spyOn(storage, 'getItem')
      service = TestBed.inject(LocalStorage)
    })

    test('returns item by key with configured prefix', () => {
      service.getItem('key')
      expect(lsFnSpy).toHaveBeenCalledTimes(1)
      expect(lsFnSpy).toHaveBeenCalledWith(`${prefix}key`)
    })
    test('parses value before returning', () => {
      const value = { ok: true, values: [] }
      lsFnSpy.mockReturnValue(JSON.stringify(value))
      expect(service.getItem('key')).toEqual(value)
    })
    test('returns null when not parsable', () => {
      lsFnSpy.mockReturnValue('this value is not parsable')
      expect(service.getItem('key')).toEqual(null)
    })
  })

  describe('delete', () => {
    beforeEach(() => {
      configureTestBed()
      storage = TestBed.inject(WindowRef).nativeWindow!.localStorage
      lsFnSpy = jest.spyOn(storage, 'removeItem')
      service = TestBed.inject(LocalStorage)
    })
    test('removes item by key with configured prefix', () => {
      service.delete('key')
      expect(lsFnSpy).toHaveBeenCalledWith(`${prefix}key`)
    })
    test('removes multiple items by keys with configured prefix', () => {
      const keys = ['a', 'b', 'c', 'd']
      service.delete(...keys)
      expect(lsFnSpy).toHaveBeenCalledTimes(keys.length)
      for (let i = 0; i < keys.length; i++) {
        expect(lsFnSpy).toHaveBeenNthCalledWith(i + 1, `${prefix}${keys[i]}`)
      }
    })
  })

  describe('clear', () => {
    let lsClearSpy: jest.SpyInstance<any, any>
    beforeEach(() => {
      configureTestBed()
      storage = TestBed.inject(WindowRef).nativeWindow!.localStorage
      lsFnSpy = jest.spyOn(storage, 'removeItem')
      lsClearSpy = jest.spyOn(storage, 'clear')
      service = TestBed.inject(LocalStorage)
    })
    test('does not use clear', () => {
      service.clear()
      expect(lsClearSpy).not.toHaveBeenCalled()
    })
    test('clears all keys starting with configured prefix', () => {
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
    test('returns all keys starting with configured prefix but removes prefix', () => {
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
