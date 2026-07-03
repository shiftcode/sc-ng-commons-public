import { isPlatformBrowser } from '@angular/common'
import {
  EnvironmentInjector,
  inject,
  makeEnvironmentProviders,
  PLATFORM_ID,
  provideEnvironmentInitializer,
  runInInjectionContext,
} from '@angular/core'

import { TESTING_FAB_WIDGETS } from './testing-fab-config.token'
import { TestingFabWidget } from './testing-fab-widget.type'

type ValueOrFactory<T> = T | (() => T)

/**
 * Provides the testing FAB with the given widgets and enables it based on the provided flag.
 * if not flag is provided, the FAB will be enabled by default.
 * Will only initialize the FAB in the browser platform.
 */
export function provideTestingFab(
  widgets: ValueOrFactory<readonly TestingFabWidget[]>,
  enabled: ValueOrFactory<boolean> = true,
) {
  return makeEnvironmentProviders([
    {
      provide: TESTING_FAB_WIDGETS,
      ...(typeof widgets === 'function' ? { useFactory: widgets } : { useValue: widgets }),
    },
    provideEnvironmentInitializer(() => {
      const envInjector = inject(EnvironmentInjector)
      const platform = inject(PLATFORM_ID)
      const isEnabled = typeof enabled === 'function' ? enabled() : enabled

      if (isPlatformBrowser(platform) && isEnabled) {
        void import('./initialize-testing-fab')
          .then((module) => module.default)
          .then((initFn) => runInInjectionContext(envInjector, initFn))
      }
    }),
  ])
}
