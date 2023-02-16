import { Directive, Input, ViewContainerRef, ViewRef } from '@angular/core'

/**
 * Directive to insert a viewRef to the template.
 * using this directive makes something like  `@ViewChild('myContainer', {read: ViewContainerRef}) myContainer:ViewContainerRef` superfluous
 * @example
 * ```typescript
 * class ComponentX {
 *    readonly componentRef: ComponentRef<any> = createComponent(MyDynamicComponent, {...})
 * }
 * ```
 * ```html
 *   <ng-template [scInsertViewRef]="componentRef.hostView"></ng-template>
 * ```
 */
@Directive({ selector: '[scInsertViewRef]', standalone: true })
export class InsertViewRefDirective {
  private _insertedViewRef: ViewRef | null = null

  @Input()
  set scInsertViewRef(val: ViewRef | null | undefined) {
    if (this._insertedViewRef) {
      this.container.remove(this.container.indexOf(this._insertedViewRef))
    }

    this._insertedViewRef = val ? this.container.insert(val) : null
  }

  constructor(private container: ViewContainerRef) {}
}
