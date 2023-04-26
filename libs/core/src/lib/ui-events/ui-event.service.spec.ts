import { DOCUMENT } from '@angular/common'
import { TestBed } from '@angular/core/testing'
import { firstValueFrom, Observable } from 'rxjs'
import { UIEventService } from './ui-event.service'

class CustomEvent extends Event {
  static readonly TYPE = 'custom'

  constructor(readonly value: any) {
    super(CustomEvent.TYPE, { bubbles: true })
  }
}

describe('UIEventService', () => {
  let doc: Document
  let service: UIEventService

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [] })
    doc = TestBed.inject(DOCUMENT)
    service = TestBed.inject(UIEventService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should return same observable for multiple identical requests', () => {
    const obs1 = service.forEvent('click', 'document')
    const obs2 = service.forEvent('click', 'document')
    expect(obs1).toBe(obs2)
  })

  it('returned observable should emit on events from element', async () => {
    const el = doc.createElement('button')
    const elClick$: Observable<CustomEvent> = <any>service.forEvent(CustomEvent.TYPE, el)
    const firstClick = firstValueFrom(elClick$)
    el.dispatchEvent(new CustomEvent('abc'))

    const receivedEvent = await firstClick
    expect(receivedEvent).toBeInstanceOf(CustomEvent)
    expect(receivedEvent.value).toBe('abc')
  })

  it('works with document', async () => {
    const elClick$: Observable<CustomEvent> = <any>service.forEvent(CustomEvent.TYPE, 'document')
    const firstClick = firstValueFrom(elClick$)
    doc.dispatchEvent(new CustomEvent('def'))

    const receivedEvent = await firstClick
    expect(receivedEvent).toBeInstanceOf(CustomEvent)
    expect(receivedEvent.value).toBe('def')
  })
})
