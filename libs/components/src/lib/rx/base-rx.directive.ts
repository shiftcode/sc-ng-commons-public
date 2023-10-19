import { DestroyRef, EmbeddedViewRef, inject, TemplateRef, Type, ViewContainerRef } from '@angular/core'
import { from, isObservable, ObservableInput, Subscription } from 'rxjs'
import { ERROR_INPUT_NAME, RX_DEFAULT_ERROR_COMPONENT } from './internals'

export abstract class BaseRxDirective<T, Ctx> {
  protected _input: ObservableInput<T> | null
  protected _subscription: Subscription | null = null
  protected _dataViewRef: EmbeddedViewRef<Ctx> | null = null

  protected readonly templateRef: TemplateRef<Ctx> = inject(TemplateRef)
  protected readonly containerRef = inject(ViewContainerRef)

  protected _errorTplOrComponent: TemplateRef<{ $implicit: unknown }> | Type<any> | null = inject(
    RX_DEFAULT_ERROR_COMPONENT,
    { optional: true },
  )

  protected constructor() {
    inject(DestroyRef).onDestroy(this.unsubscribe.bind(this))
  }

  /** use this to call {@link renderDataView} */
  protected abstract handleNextValue(value: T): void

  /** use this to call {@link renderError} */
  protected abstract handleError(err: unknown): void

  protected unsubscribe() {
    if (this._subscription) {
      this._subscription.unsubscribe()
      this._subscription = null
    }
  }

  protected subscribe(input: ObservableInput<T>) {
    const value$ = isObservable(input) ? input : from(input)
    this._subscription = value$.subscribe({
      next: this.handleNextValue.bind(this),
      error: this.handleError.bind(this),
    })
  }

  /**
   * updates the embedded view with the new context
   * or clears the container and creates the embedded view if not yet the dataView is shown
   */
  protected renderDataView(context: Ctx) {
    if (this._dataViewRef && this.containerRef.indexOf(this._dataViewRef) === 0) {
      this._dataViewRef.context = context
    } else {
      this.clear()
      this._dataViewRef = this.containerRef.createEmbeddedView(this.templateRef, context)
    }
    this._dataViewRef.detectChanges()
  }

  /**
   *  clears the view and renders the error component/template if any
   */
  protected renderError(error: unknown) {
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

  protected clear() {
    this.containerRef.clear()
    this._dataViewRef = null
  }
}
