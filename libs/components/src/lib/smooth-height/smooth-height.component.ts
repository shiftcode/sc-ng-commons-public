import {
  afterNextRender,
  booleanAttribute,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core'

/**
 * Standalone Component to smoothly animate height changes.
 * Animates the height property when the content of sc-smooth-height changes
 * use the {@link trigger} input to provide the essential value changes to trigger a resize
 */
@Component({
  selector: 'sc-smooth-height',
  standalone: true,
  template: `<ng-content />`,
  styleUrls: ['./smooth-height.component.scss'],
})
export class SmoothHeightComponent {
  readonly withInitialAnimation = input(false, { transform: booleanAttribute })
  readonly animationOptions = input<Pick<EffectTiming, 'duration' | 'easing'>>({ duration: 300, easing: 'ease-in-out' })

  // we do not use initial
  private readonly height = signal<number | null>(null)
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef)

  constructor() {
    const destroyRef = inject(DestroyRef)

    afterNextRender(() => {
      const obs = new MutationObserver(this.updateElementHeight.bind(this))
      obs.observe(this.elementRef.nativeElement, { attributes: true, subtree: true, characterData: true })
      this.updateElementHeight()
      destroyRef.onDestroy(() => obs?.disconnect())
    })

    let prevHeight: number | null = null
    effect(() => {
      let height = this.height()

      if (height === null) {
        if (untracked(this.withInitialAnimation)) {
          height = 0
        } else {
          return
        }
      }

      if (prevHeight !== null) {
        this.elementRef.nativeElement.animate(
          [{ height: `${prevHeight}px` }, { height: `${height}px` }],
          untracked(this.animationOptions),
        )
      }
      prevHeight = height
    })
  }

  private updateElementHeight() {
    this.height.set(this.elementRef.nativeElement.clientHeight)
  }
}
