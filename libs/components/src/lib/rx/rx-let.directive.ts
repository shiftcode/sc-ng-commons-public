import {
  ComponentRef,
  Directive,
  EmbeddedViewRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core'
import { from, Observable, Subscription } from 'rxjs'
import {
  assertAngularInput,
  ERROR_INPUT_NAME,
  RX_DEFAULT_ERROR_COMPONENT,
  RX_DEFAULT_SUSPENSE_COMPONENT,
} from './internals'

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
export class RxLetDirective<T> implements OnChanges, OnDestroy {
  @Input()
  set scRxLetOf(value: Observable<T> | Promise<T> | null) {
    this._value = value
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

  /** whether the current provided observable has emitted a value yet */
  private isSuspense: boolean
  private _suspenseTplOrComponent: TemplateRef<void> | null | Type<any> = inject(RX_DEFAULT_SUSPENSE_COMPONENT, {
    optional: true,
  })
  private _errorTplOrComponent:
    | TemplateRef<{
        $implicit: unknown
      }>
    | Type<any>
    | null = inject(RX_DEFAULT_ERROR_COMPONENT, { optional: true })

  private _subscription: Subscription | null = null
  private _dataViewRef: EmbeddedViewRef<RxLetContext<T>> | null = null
  private _suspenseViewRef: EmbeddedViewRef<void> | ComponentRef<any> | null = null
  private _value: Observable<T> | Promise<T> | null = null

  static ngTemplateContextGuard<T>(dir: RxLetDirective<T>, ctx: any): ctx is RxLetContext<T> {
    return true
  }

  constructor(
    private readonly templateRef: TemplateRef<RxLetContext<T>>,
    private readonly containerRef: ViewContainerRef,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['scRxLetOf' satisfies keyof RxLetDirective<any>]) {
      this.handleNewValue(this._value)
    }
  }

  ngOnDestroy() {
    this._subscription?.unsubscribe()
  }

  private handleNewValue(value: Observable<T> | Promise<T> | null) {
    // for every new value we set the suspense view (unless an event will be emitted synchronously)
    this.isSuspense = true

    if (this._subscription) {
      this._subscription.unsubscribe()
      this._subscription = null
    }
    if (value) {
      const value$ = value instanceof Promise ? from(value) : value
      this._subscription = value$.subscribe({
        next: this.renderDataView.bind(this),
        error: this.renderErrorView.bind(this),
      })
      if (this.isSuspense) {
        // if the observable did not emit synchronously, we can show the suspense view
        this.renderSuspenseView()
      }
    } else {
      // show the suspense view when null is passed
      this.renderSuspenseView()
    }
  }

  private renderDataView(value: T) {
    this.isSuspense = false

    if (this._suspenseViewRef) {
      this.clear()
      this._suspenseViewRef = null
    }
    if (this._dataViewRef) {
      this._dataViewRef.context = { $implicit: value }
    } else {
      this._dataViewRef = this.containerRef.createEmbeddedView(this.templateRef, { $implicit: value })
    }
    this._dataViewRef.detectChanges()
  }

  private renderErrorView(error: unknown) {
    this.isSuspense = false

    this.clear()
    if (!this._errorTplOrComponent) {
      return
    } else if (this._errorTplOrComponent instanceof TemplateRef) {
      const ref = this.containerRef.createEmbeddedView(this._errorTplOrComponent, { $implicit: error })
      ref.detectChanges()
    } else {
      const ref = this.containerRef.createComponent(this._errorTplOrComponent)
      ref.setInput(ERROR_INPUT_NAME, error)
      ref.changeDetectorRef.detectChanges()
    }
  }

  // called twice: once in ngOnInit and once in handleNewValue (in case the observableLike changes)
  private renderSuspenseView() {
    if (this._suspenseTplOrComponent) {
      this.clear()

      if (this._suspenseTplOrComponent instanceof TemplateRef) {
        const ref = this.containerRef.createEmbeddedView(this._suspenseTplOrComponent)
        ref.detectChanges()
        this._suspenseViewRef = ref
      } else {
        const ref = this.containerRef.createComponent(this._suspenseTplOrComponent)
        ref.changeDetectorRef.detectChanges()
        this._suspenseViewRef = ref
      }
    }
  }

  private clear() {
    this.containerRef.clear()
    this._dataViewRef = null
    this._suspenseViewRef = null
  }
}
