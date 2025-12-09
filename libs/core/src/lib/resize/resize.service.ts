import { isPlatformBrowser } from '@angular/common'
import { inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core'
import { filter, finalize, NEVER, Observable, Subject } from 'rxjs'

import { setup } from '../static-utils/rxjs/setup.operator'
import { RESIZE_OBSERVER_IMPL } from './resize-observer-impl.token'

@Injectable({ providedIn: 'root' })
export class ResizeService implements OnDestroy {
  private readonly observer: ResizeObserver | null
  private readonly eventSubject = new Subject<ResizeObserverEntry>()

  constructor() {
    const impl = inject(RESIZE_OBSERVER_IMPL, { optional: true })

    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      this.observer = impl ? new impl(this.onResize) : new ResizeObserver(this.onResize)
    } else {
      this.observer = null
    }
  }

  observe(element: Element): Observable<any> {
    if (this.observer) {
      return this.eventSubject.asObservable().pipe(
        // setupFn --> called when subscribed
        setup(() => this.observer?.observe(element)),
        // filter to observed element
        filter((ev) => ev.target === element),
        // finalizeFn --> called when completed
        finalize(() => this.observer?.unobserve(element)),
      )
    } else {
      return NEVER
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }

  private readonly onResize: ResizeObserverCallback = (entries) => {
    entries.map((entry) => this.eventSubject.next(entry))
  }
}
