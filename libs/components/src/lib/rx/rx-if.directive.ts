import { Directive, EmbeddedViewRef, Input, OnChanges, SimpleChanges, TemplateRef, Type } from '@angular/core'
import { asapScheduler, ObservableInput, Subscription } from 'rxjs'
import { BaseRxDirective } from './base-rx.directive'
import { assertAngularInput, ERROR_INPUT_NAME } from './internals'

export interface RxIfContext<T> {
  $implicit: T
}

@Directive({ selector: '[scRxIf]', standalone: true })
export class RxIfDirective<T> extends BaseRxDirective<T | null | undefined, RxIfContext<T>> implements OnChanges {
  @Input()
  set scRxIf(value: ObservableInput<T | null | undefined> | null) {
    this._input = value
  }

  @Input()
  set scRxIfElse(tpl: TemplateRef<void>) {
    this._elseTplRef = tpl
  }

  @Input()
  set scRxIfError(tpl: TemplateRef<{ $implicit: unknown }> | Type<any> | null) {
    if (tpl !== null && tpl !== undefined && !(tpl instanceof TemplateRef)) {
      // not a template ref -> must be a component
      assertAngularInput(tpl, ERROR_INPUT_NAME)
    }
    this._errorTplOrComponent = tpl
  }

  protected handleNextValue(value: T | null | undefined) {
    this._elseRenderSubscription?.unsubscribe()
    this._elseRenderSubscription = null

    if (value !== null && value !== undefined) {
      this.renderDataView({ $implicit: value })
    } else {
      this.renderElseOrClear()
    }
  }

  private _elseRenderSubscription: Subscription | null = null
  private _elseTplRef: TemplateRef<void> | null = null
  private _elseViewRef: EmbeddedViewRef<void> | null = null

  static ngTemplateContextGuard<T>(dir: RxIfDirective<T>, ctx: any): ctx is RxIfContext<T> {
    return true
  }

  constructor() {
    super()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['scRxIfElse' satisfies keyof this]) {
      this._elseViewRef = null // forces it to rerender if it currently exists
    }
    if (changes['scRxIf' satisfies keyof this]) {
      this.subscribeTo(this._input)
    }
  }

  override clear() {
    super.clear()
    this._elseViewRef = null
  }

  private subscribeTo(input: ObservableInput<T | null | undefined> | null) {
    this.unsubscribe()
    // we only want it to `clear` if the input won't emit synchronously
    this._elseRenderSubscription = asapScheduler.schedule(this.renderElseOrClear.bind(this))
    if (input) {
      super.subscribe(input)
    } else {
      this.renderElseOrClear()
    }
  }

  private renderElseOrClear() {
    if (this._elseTplRef) {
      this.renderElseView(this._elseTplRef)
    } else {
      this.clear()
    }
  }

  private renderElseView(tplRef: TemplateRef<void>) {
    if (this._elseViewRef && this.containerRef.indexOf(this._elseViewRef) === 0) {
      return
    } else {
      this.clear()
      this._elseViewRef = this.containerRef.createEmbeddedView(tplRef)
      this._elseViewRef.detectChanges()
    }
  }
}
