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
  @Input()
  set scInsertViewRef(val: ViewRef | null | undefined) {
    this.container.clear()
    if (val) {
      this.insert(val)
    }
  }

  get hasAttachedView(): boolean {
    return this.container.length > 0
  }

  constructor(private container: ViewContainerRef) {}

  /**
   * Inserts a view into the container.
   * @throws when a view is already attached
   */
  insert(val: ViewRef) {
    if (this.hasAttachedView) {
      throw new Error('container already has a view attached')
    }
    this.container.insert(val)
  }

  /**
   * Detaches the view from the container and returns its {@link ViewRef}.
   * When detaching a view, it will no longer be auto-destroyed when the directive gets destroyed
   * therefore it's necessary to manually destroy it manually at some point
   * @throws when no view attached
   */
  detach(): ViewRef {
    const r = this.container.detach(0)
    if (!r) {
      throw new Error('container has no view attached')
    }
    return r
  }
}
