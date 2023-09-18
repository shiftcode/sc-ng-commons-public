import {
  ComponentRef,
  Directive,
  EmbeddedViewRef,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  Type,
} from '@angular/core'
import { asapScheduler, ObservableInput, Subscription } from 'rxjs'
import { BaseRxDirective } from './base-rx.directive'
import { assertAngularInput, ERROR_INPUT_NAME, RX_DEFAULT_SUSPENSE_COMPONENT } from './internals'

export interface RxLetContext<T> {
  $implicit: T
}

/**
 * Directive to render a template based on an observable or promise.
 * shows the loader when no value (initially; opt-out possible) and errors (opt-out possible)
 * -> use `scRxLet` instead of `ngIf` + `async` pipe -> does not trigger CD on outer component when new value emitted
 * HINT: as it does not trigger a CD on the outer component, potential View/Content Queries won't be updated
 *
 * @example ```html
 * <ng-container *scRxLet="let user of user$">
 *   <app-avatar [user]="user" />
 * </ng-container>
 * ```
 */
@Directive({ selector: '[scRxLet][scRxLetOf]', standalone: true })
export class RxLetDirective<T> extends BaseRxDirective<T, RxLetContext<T>> implements OnChanges {
  @Input()
  set scRxLetOf(value: ObservableInput<T> | null) {
    this._input = value
  }

  @Input()
  set scRxLetSuspense(tpl: TemplateRef<void> | Type<any> | null) {
    this._suspenseTplOrComponent = tpl
  }

  @Input()
  set scRxLetError(tpl: TemplateRef<{ $implicit: unknown }> | Type<any> | null) {
    if (tpl !== null && tpl !== undefined && !(tpl instanceof TemplateRef)) {
      // not a template ref -> must be a component
      assertAngularInput(tpl, ERROR_INPUT_NAME)
    }
    this._errorTplOrComponent = tpl
  }

  protected handleNextValue(value: T) {
    this._suspenseRenderSubscription?.unsubscribe()
    this._suspenseRenderSubscription = null

    if (this._suspenseViewRef) {
      this.clear()
    }
    this.renderDataView({ $implicit: value })
  }

  private _suspenseRenderSubscription: Subscription | null = null
  private _suspenseTplOrComponent: TemplateRef<void> | null | Type<any> = inject(RX_DEFAULT_SUSPENSE_COMPONENT, {
    optional: true,
  })
  private _suspenseViewRef: EmbeddedViewRef<void> | ComponentRef<any> | null = null

  static ngTemplateContextGuard<T>(dir: RxLetDirective<T>, ctx: any): ctx is RxLetContext<T> {
    return true
  }

  constructor() {
    super()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['scRxLetSuspense' satisfies keyof this]) {
      this._suspenseViewRef = null // forces it to rerender if it currently exists
    }
    if (changes['scRxLetOf' satisfies keyof this]) {
      this.subscribeTo(this._input)
    }
  }

  override clear() {
    super.clear()
    this._suspenseViewRef = null
  }

  private subscribeTo(input: ObservableInput<T> | null) {
    // for every new value we set the suspense view (unless an event will be emitted synchronously)
    this._suspenseRenderSubscription = asapScheduler.schedule(this.renderSuspenseViewOrClear.bind(this))

    this.unsubscribe()
    if (input) {
      this.subscribe(input)
    }
  }

  private renderSuspenseViewOrClear() {
    if (this._suspenseTplOrComponent) {
      this.renderSuspenseView(this._suspenseTplOrComponent)
    } else {
      this.clear()
    }
  }

  private renderSuspenseView(tplRefOrComponent: Type<any> | TemplateRef<any>) {
    if (
      this._suspenseViewRef &&
      this.containerRef.indexOf(
        this._suspenseViewRef instanceof ComponentRef ? this._suspenseViewRef.hostView : this._suspenseViewRef,
      ) === 0
    ) {
      return
    } else {
      this.clear()
      if (tplRefOrComponent instanceof TemplateRef) {
        const ref = this.containerRef.createEmbeddedView(tplRefOrComponent)
        ref.detectChanges()
        this._suspenseViewRef = ref
      } else {
        const ref = this.containerRef.createComponent(tplRefOrComponent)
        ref.changeDetectorRef.detectChanges()
        this._suspenseViewRef = ref
      }
    }
  }
}
