import { isPlatformBrowser } from '@angular/common'
import { Inject, Injectable, OnDestroy, Optional, PLATFORM_ID, Type } from '@angular/core'
import { setup } from '../static-utils/rxjs/setup.operator'
import { NEVER, Observable, Subject } from 'rxjs'
import { filter, finalize } from 'rxjs/operators'
import { RESIZE_OBSERVER_IMPL } from './resize-observer-impl.token'

@Injectable({ providedIn: 'root' })
export class ResizeService implements OnDestroy {
  private readonly observer: ResizeObserver | null
  private readonly eventSubject = new Subject<ResizeObserverEntry>()

  constructor(
    @Inject(PLATFORM_ID) platformId: any,
    @Optional() @Inject(RESIZE_OBSERVER_IMPL) impl?: Type<ResizeObserver>,
  ) {
    if (isPlatformBrowser(platformId)) {
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
