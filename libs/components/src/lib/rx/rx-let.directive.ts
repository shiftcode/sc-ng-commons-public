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
  /** by using the directive name we enable the `as` syntax */
  scRxLet: T
}

/**
 * Directive to render a template based on an observable or promise.
 * - renders the view in case of any emitted value
 * - renders the suspense template/component (if specified or a default was set) as long as there is no value resolved or emitted
 * - renders the error template/component (if specified or a default was set) in case of an error
 * -> use `scRxLet` instead of `ngIf` + `async` pipe -> does not trigger CD on outer component when new value emitted
 * @hint to disable the suspense template null can be provided
 * @hint: as it does not trigger a CD on the outer component, potential View/Content Queries won't be updated
 *
 * @example ```html
 * <ng-template #specialErrorTpl let-error>Special Error {{error}}</ng-template>
 * <ng-container *scRxLet="user$ as user; error:specialErrorTpl">
 *   <app-avatar [user]="user" />
 * </ng-container>
 * ```
 * @example ```html
 * <!-- prevent the default suspense component -->
 * <ng-container *scRxLet="user$ as user; suspense:null">
 *   <app-avatar [user]="user" />
 * </ng-container>
 * ```
 */
@Directive({ selector: '[scRxLet]' })
export class RxLetDirective<T> extends BaseRxDirective<T, RxLetContext<T>> implements OnChanges {
  @Input()
  set scRxLet(value: ObservableInput<T> | null) {
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
    if (changes['scRxLet' satisfies keyof this]) {
      this.subscribeTo(this._input)
    }
  }

  protected handleNextValue(value: T) {
    this._suspenseRenderSubscription?.unsubscribe()
    this._suspenseRenderSubscription = null

    // if (this._suspenseViewRef) {
    //   this.clear()
    // }
    this.renderDataView({ scRxLet: value })
  }

  protected handleError(err: unknown) {
    this._suspenseRenderSubscription?.unsubscribe()
    this._suspenseRenderSubscription = null
    this.renderError(err)
  }

  protected override clear() {
    super.clear()
    this._suspenseViewRef = null
  }

  private subscribeTo(input: ObservableInput<T> | null) {
    this.unsubscribe()

    /**
     * we want the suspenseTemplate (or clear if not set) to be rendered asap in case of `input==null` or
     * in case of a non-sync-emitting observable (or promise)
     * we only want it to clear/use the suspenseTemplate if the input won't emit synchronously (or e.g. when input is null)
     * the _suspenseRenderSubscription is cleared in the handleNextValue
     */
    this._suspenseRenderSubscription = asapScheduler.schedule(this.renderSuspenseViewOrClear.bind(this))

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
