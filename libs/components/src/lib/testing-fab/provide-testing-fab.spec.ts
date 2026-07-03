import { EnvironmentProviders } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { DefaultUrlSerializer, Router } from '@angular/router'
import { LocalStorage } from '@shiftcode/ngx-core'
import { NEVER } from 'rxjs'
import { describe, expect, test, vi } from 'vitest'

import { provideTestingFab } from './provide-testing-fab'
import { TESTING_FAB_WIDGETS } from './testing-fab-config.token'
import { TestingFabWidget } from './testing-fab-widget.type'

function setup(testingFabProviders: EnvironmentProviders) {
  const serializer = new DefaultUrlSerializer()

  function createRouterMock(): Router {
    return {
      events: NEVER,
      url: '/',
      parseUrl: vi.fn<typeof serializer.parse>((value) => serializer.parse(value)),
      navigate: vi.fn().mockResolvedValue(true),
    } as unknown as Router
  }

  function createLocalStorageMock(): LocalStorage {
    return {
      persistent: true,
      observe: vi.fn(),
      setItem: vi.fn(),
      getItem: vi.fn().mockReturnValue(null),
      delete: vi.fn(),
      clear: vi.fn(),
      keys: vi.fn().mockReturnValue([]),
    } as unknown as LocalStorage
  }

  TestBed.configureTestingModule({
    providers: [
      { provide: Router, useValue: createRouterMock() },
      { provide: LocalStorage, useValue: createLocalStorageMock() },
      testingFabProviders,
    ],
  })
}

describe('provideTestingFab', () => {
  test('supports static widgets config and renders the testing fab', () => {
    const widgets: readonly TestingFabWidget[] = [{ id: 'a1', label: 'Action', type: 'action', action: vi.fn() }]

    setup(provideTestingFab(widgets))

    expect(TestBed.inject(TESTING_FAB_WIDGETS)).toEqual(widgets)
  })

  test('supports factory widgets config', () => {
    const widgets: readonly TestingFabWidget[] = [{ id: 'a1', label: 'Action', type: 'action', action: vi.fn() }]
    const factory = vi.fn(() => widgets)

    setup(provideTestingFab(factory))

    expect(TestBed.inject(TESTING_FAB_WIDGETS)).toEqual(widgets)
    expect(factory).toHaveBeenCalled()
  })
})
