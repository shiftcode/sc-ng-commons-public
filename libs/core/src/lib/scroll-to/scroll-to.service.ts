import { DOCUMENT } from '@angular/common'
import { inject, Injectable } from '@angular/core'
import { Logger } from '@shiftcode/logger'
import { LoggerService } from '../logger/logger.service'
import { WindowRef } from '../window/window-ref.service'

const DURATION_MIN = 0.1
const DURATION_MAX = 0.8

@Injectable({ providedIn: 'root' })
export class ScrollToService {
  private readonly logger: Logger = inject(LoggerService).getInstance('ScrollToService')
  private readonly window: Window | null = inject(WindowRef).nativeWindow
  private readonly document: Document = inject<Document>(DOCUMENT)

  scrollTo(scrollTargetY: number = 0, speed: number = 2000): void {
    const scrollY = this.window?.scrollY ?? this.window?.pageYOffset ?? 0
    const currentTime = 0
    const time = Math.max(DURATION_MIN, Math.min(Math.abs(scrollY - scrollTargetY) / speed, DURATION_MAX))

    this.tick(currentTime, time, scrollTargetY, scrollY)
  }

  scrollToNoAnimation(scrollTarget: number | string | HTMLElement, offsetY: number = 0): void {
    this.window?.scrollTo(this.getScrollTargetY(scrollTarget, offsetY), 0)
  }

  scrollToElement(scrollTargetEl: HTMLElement, offset: number = 0, speed: number = 2000) {
    let scrollTargetY: number
    if (scrollTargetEl && scrollTargetEl instanceof HTMLElement) {
      scrollTargetY = this.getScrollTargetY(scrollTargetEl)
    } else {
      this.logger.warn('could not find HTMLElement with will scroll to top (y = 0)', scrollTargetEl)
      scrollTargetY = 0
    }
    this.scrollTo(scrollTargetY - offset, speed)
  }

  scrollElementToTop(container: HTMLElement) {
    container.scrollTop = 0
  }

  scrollElementTo(scrollTargetY: number = 0, speed: number = 2000, container: HTMLElement): void {
    const scrollY = container.scrollTop
    const currentTime = 0
    const time = Math.max(DURATION_MIN, Math.min(Math.abs(scrollY - scrollTargetY) / speed, DURATION_MAX))

    this.scrollTickElement(currentTime, time, scrollTargetY, scrollY, container)
  }

  getScrollTargetY(scrollTarget: number | string | HTMLElement, offsetY: number = 0): number {
    let scrollTargetY: number
    const body: HTMLElement = this.document.documentElement || this.document.body

    if (typeof scrollTarget === 'string' || scrollTarget instanceof HTMLElement) {
      // find the element with id query selector
      let htmlElement: Element | null
      if (typeof scrollTarget === 'string') {
        htmlElement = body.querySelector(`#${scrollTarget}`)
      } else {
        htmlElement = scrollTarget
      }

      if (!htmlElement) {
        this.logger.warn('could not find HTMLElement with id -> will scroll to top (y = 0)', scrollTarget)
        scrollTargetY = 0
      } else {
        const scrollY = this.window?.pageYOffset ?? body.scrollTop
        scrollTargetY = htmlElement.getBoundingClientRect().top + scrollY
      }
    } else {
      scrollTargetY = scrollTarget
    }

    scrollTargetY -= offsetY

    return scrollTargetY
  }

  private tick(currentTime: number, time: number, scrollTargetY: number, scrollY: number) {
    currentTime += 1 / 60

    const p = currentTime / time
    const t = this.easingFn(p)
    if (this.window) {
      if (p < 1) {
        this.window.requestAnimationFrame(() => {
          this.tick(currentTime, time, scrollTargetY, scrollY)
        })
        this.window.scrollTo(0, scrollY + (scrollTargetY - scrollY) * t)
      } else {
        this.window.scrollTo(0, scrollTargetY)
      }
    }
  }

  private scrollTickElement(
    currentTime: number,
    time: number,
    scrollTargetY: number,
    scrollY: number,
    container: HTMLElement,
  ) {
    if (this.window) {
      currentTime += 1 / 60

      const p = currentTime / time
      const t = this.easingFn(p)

      container.scrollTop = scrollTargetY
      if (p < 1) {
        this.window.requestAnimationFrame(() => {
          this.scrollTickElement(currentTime, time, scrollTargetY, scrollY, container)
        })

        container.scrollTop = scrollY + (scrollTargetY - scrollY) * t
      } else {
        container.scrollTop = scrollTargetY
      }
    }
  }

  private easingFn(pos: number) {
    return -0.5 * (Math.cos(Math.PI * pos) - 1)
  }
}
