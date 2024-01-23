import { DOCUMENT } from '@angular/common'
import { APP_INITIALIZER, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router'
import { delay, filter, switchMap, take, tap } from 'rxjs'

function provideNavigationClassHandlerFactory(
  this: undefined,
  className: string,
  doc: Document,
  router: Router,
): () => Promise<void> {
  return () => {
    const navigationEnd$ = router.events.pipe(
      filter((ev) => ev instanceof NavigationEnd || ev instanceof NavigationCancel || ev instanceof NavigationError),
    )

    router.events
      .pipe(
        filter((e) => e instanceof NavigationStart),
        tap(() => doc.body.classList.add(className)),
        switchMap(() => navigationEnd$.pipe(take(1), delay(0))),
        tap(() => doc.body.classList.remove(className)),
      )
      .subscribe()

    // since we provide the factory as `APP_INITIALIZER` to get called, we need to return a promise
    return Promise.resolve()
  }
}

/**
 * sets up a handler which adds the provided css class to the document#body while angular router is navigating
 */
export function provideNavigationClassHandler(className: string): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: provideNavigationClassHandlerFactory.bind(void 0, className),
      deps: [DOCUMENT, Router],
    },
  ])
}
