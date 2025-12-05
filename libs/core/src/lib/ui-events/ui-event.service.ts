import { DOCUMENT, inject, Injectable } from '@angular/core'
import { filter, finalize, fromEvent, merge, Observable } from 'rxjs'

import { WindowRef } from '../window/window-ref.service'

@Injectable({ providedIn: 'root' })
export class UIEventService {
  private readonly document = inject(DOCUMENT)
  private readonly window = inject(WindowRef).nativeWindow

  // Map<string, Map<FromEventTarget, Observable<UIEvent>>> -> FromEventTarget is internal source of rxjs
  private observables: Map<string, Map<any, Observable<UIEvent>>> = new Map<string, Map<any, Observable<UIEvent>>>()

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  forEvent(types: string | string[], target: 'document' | 'window' | 'body' | any = 'document'): Observable<UIEvent> {
    if (Array.isArray(types)) {
      const obs: Array<Observable<UIEvent>> = types.map((type) => this.forSingleEvent(type, target))
      return merge(...obs)
    } else {
      return this.forSingleEvent(types, target)
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  private forSingleEvent(type: string, target: 'document' | 'window' | 'body' | any): Observable<UIEvent> {
    // init the type object to store the observables linked to the event target
    const map = this.observables.get(type) || new Map<any, Observable<UIEvent>>()

    if (!this.observables.has(type)) {
      this.observables.set(type, map)
    }

    // if no target is defined, use the document
    if (target === 'window') {
      target = this.window
    } else if (target === 'document') {
      target = this.document
    } else if (target === 'body') {
      target = this.document.body
    }

    let event$ = map.get(target)
    if (!event$) {
      event$ = fromEvent<UIEvent>(target, type).pipe(finalize<UIEvent>(() => map.delete(target)))

      if (type === 'mouseout') {
        event$ = event$.pipe(filter((event) => event.target === this.window?.document))
      }
      map.set(target, event$)
    }

    return event$
  }
}
