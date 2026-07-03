import { DOCUMENT } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { LocalStorage } from '@shiftcode/ngx-core'
import { describe, expect, test, vi } from 'vitest'

import initializeTestingFab from './initialize-testing-fab'
import { TESTING_FAB_WIDGETS } from './testing-fab-config.token'

describe('initializeTestingFab', () => {
  test('creates the host element', () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: TESTING_FAB_WIDGETS, useValue: [] },
        {
          provide: LocalStorage,
          useValue: {
            getItem: vi.fn().mockReturnValue(null),
            setItem: vi.fn(),
          } as unknown as LocalStorage,
        },
      ],
    })

    TestBed.runInInjectionContext(initializeTestingFab)

    expect(TestBed.inject(DOCUMENT).querySelector('sc-testing-fab')).not.toBeNull()
  })
})
