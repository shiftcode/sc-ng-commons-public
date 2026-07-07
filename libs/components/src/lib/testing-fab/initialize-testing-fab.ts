import { DOCUMENT } from '@angular/common'
import {
  ApplicationRef,
  assertInInjectionContext,
  createComponent,
  DestroyRef,
  EnvironmentInjector,
  inject,
} from '@angular/core'

import { TestingFabComponent } from './testing-fab.component'

/**
 * Initializes the testing FAB by creating and attaching the TestingFabComponent to the document body.
 * needs to be run in the injection context.
 */
export default function initializeTestingFab() {
  assertInInjectionContext(initializeTestingFab)
  const doc = inject(DOCUMENT)
  const appRef = inject(ApplicationRef)
  const environmentInjector = inject(EnvironmentInjector)
  const destroyRef = inject(DestroyRef)

  const host = doc.createElement('sc-testing-fab')
  const cmpRef = createComponent(TestingFabComponent, {
    hostElement: host,
    environmentInjector,
  })

  appRef.attachView(cmpRef.hostView)
  doc.body.appendChild(host)

  destroyRef.onDestroy(() => {
    appRef.detachView(cmpRef.hostView)
    cmpRef.destroy()
    host.remove()
  })
}
