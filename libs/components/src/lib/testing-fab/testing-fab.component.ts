import { NgComponentOutlet } from '@angular/common'
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NavigationEnd, Router } from '@angular/router'
import { filterIfInstanceOf, LocalStorage, ORIGIN } from '@shiftcode/ngx-core'
import { map, startWith } from 'rxjs'

import { TESTING_FAB_WIDGETS } from './testing-fab-config.token'
import { TestingFabSelectQueryParamWidget } from './testing-fab-widget.type'

const FAB_POSITIONS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const
type TestingFabPosition = (typeof FAB_POSITIONS)[number]

const DEFAULT_POSITION: TestingFabPosition = 'bottom-right'
const POSITION_STORAGE_KEY = 'sc-testing-fab.position'
const DRAG_THRESHOLD_PX = 4

function parsePosition(value: unknown): TestingFabPosition | null {
  if (FAB_POSITIONS.includes(value as any)) {
    return value as TestingFabPosition
  }

  return null
}

@Component({
  selector: 'sc-testing-fab',
  standalone: true,
  imports: [NgComponentOutlet],
  styleUrls: ['./testing-fab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './testing-fab.component.html',
  host: {
    class: 'sc-testing-fab',
    '[class.sc-testing-fab--top-left]': "position() === 'top-left'",
    '[class.sc-testing-fab--top-right]': "position() === 'top-right'",
    '[class.sc-testing-fab--bottom-left]': "position() === 'bottom-left'",
    '[class.sc-testing-fab--bottom-right]': "position() === 'bottom-right'",
  },
})
export class TestingFabComponent {
  private readonly router = inject(Router)
  private readonly origin = inject(ORIGIN)
  private readonly localStorage = inject(LocalStorage)
  private dragState: { pointerId: number; startX: number; startY: number; moved: boolean } | null = null
  private preventNextClick = false
  protected readonly widgets = inject(TESTING_FAB_WIDGETS)
  protected readonly position = signal<TestingFabPosition>(
    parsePosition(this.localStorage.getItem(POSITION_STORAGE_KEY)) ?? DEFAULT_POSITION,
  )

  protected readonly queryParams = toSignal(
    this.router.events.pipe(
      filterIfInstanceOf(NavigationEnd),
      map((ev) => ev.urlAfterRedirects),
      startWith(this.router.url),
      map((path) => URL.parse(path, this.origin)?.searchParams ?? new URLSearchParams()),
    ),
    { initialValue: new URLSearchParams() },
  )

  protected readonly qpWidgetValues = computed((): Record<string, string> => {
    const qp = this.queryParams()
    return Object.fromEntries(
      this.widgets
        .filter((w) => w.type === 'select-query-param')
        .map((w) => [w.id, qp.get(w.queryParam) ?? ''] as const),
    )
  })

  constructor() {
    effect(() => this.localStorage.setItem(POSITION_STORAGE_KEY, this.position()))
  }

  protected onTriggerPointerDown(event: PointerEvent): void {
    if (event.button !== 0) {
      return
    }

    this.dragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    }
    ;(event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId)
  }

  protected onTriggerPointerMove(event: PointerEvent): void {
    if (!this.dragState || this.dragState.pointerId !== event.pointerId) {
      return
    }

    if (!this.dragState.moved) {
      const deltaX = Math.abs(event.clientX - this.dragState.startX)
      const deltaY = Math.abs(event.clientY - this.dragState.startY)
      this.dragState.moved = deltaX > DRAG_THRESHOLD_PX || deltaY > DRAG_THRESHOLD_PX
    }
  }

  protected onTriggerPointerUp(event: PointerEvent): void {
    if (!this.dragState || this.dragState.pointerId !== event.pointerId) {
      return
    }

    const { moved } = this.dragState
    this.dragState = null
    ;(event.currentTarget as HTMLElement | null)?.releasePointerCapture?.(event.pointerId)

    if (!moved) {
      return
    }

    this.preventNextClick = true
    this.position.set(this.positionFromCoordinates(event.clientX, event.clientY))
  }

  protected onTriggerPointerCancel(event: PointerEvent): void {
    if (!this.dragState || this.dragState.pointerId !== event.pointerId) {
      return
    }

    this.dragState = null
    ;(event.currentTarget as HTMLElement | null)?.releasePointerCapture?.(event.pointerId)
  }

  protected onTriggerClick(event: MouseEvent): void {
    if (!this.preventNextClick) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    this.preventNextClick = false
  }

  protected setQueryParam(widget: TestingFabSelectQueryParamWidget, event: Event) {
    const nextValue = (event.target as HTMLSelectElement).value

    if (widget.hardReload) {
      const url = new URL(window.location.href)
      if (nextValue) {
        url.searchParams.set(widget.queryParam, nextValue)
      } else {
        url.searchParams.delete(widget.queryParam)
      }

      window.location.assign(url.toString())
      return
    }

    void this.router.navigate([], {
      queryParams: {
        [widget.queryParam]: nextValue || null,
      },
      queryParamsHandling: 'merge',
    })
  }

  private positionFromCoordinates(x: number, y: number): TestingFabPosition {
    const vertical = y <= window.innerHeight / 2 ? 'top' : 'bottom'
    const horizontal = x <= window.innerWidth / 2 ? 'left' : 'right'
    return `${vertical}-${horizontal}`
  }
}
