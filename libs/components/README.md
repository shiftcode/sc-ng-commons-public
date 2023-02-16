# @shiftcode/ngx-components
Contains angular components and directives which are usable across different projects.

All components use `changeDetection: ChangeDetectionStrategy.OnPush`

## [auto-focus](./src/lib/auto-focus/auto-focus.directive.ts)
Autofocus an element when building the view.

## [button](./src/lib/button/button.component.ts)
Custom button component to fix a bug in Safari/Firefox

## [click-outside](./src/lib/click-outside/click-outside.directive.ts)
Event emitter for clicks outside an element.

## [flying-focus](./src/lib/flying-focus/flying-focus.component.ts)
Visualize focused element when using tab to navigate.
Can be customized with css custom properties:
```css
:root {
    --sc-flying-focus-gap: -4px;
    --sc-flying-focus-box-shadow: 0 0 0 2px black;
    --sc-flying-focus-border-radius: 0;
}
```

## [insert-view-ref](./src/lib/insert-view-ref/insert-view-ref.directive.ts)
Directive to insert a viewRef in a template without the need to get a ViewChild in your controller
```typescript
class ComponentX {
  readonly componentRef: ComponentRef<any> = createComponent(MyDynamicComponent, { ... })
}
```
```html
  <ng-template [scInsertViewRef]="componentRef.hostView"></ng-template>
```

## [smooth-height](./src/lib/smooth-height/smooth-height.component.ts)
Animated change height of a container triggered by a custom value.

## [svg](./src/lib/svg/svg.component.ts)
Load SVGs when used and add as svg to the DOM.

## [textarea-autosize](./src/lib/textarea-autosize/textarea-autosize.directive.ts)
Autosize the textarea while typing and/or programmatic value changes.

## [tooltip](./src/lib/tooltip/tooltip.directive.ts)
Simple Text Tooltip.
Can be customized with css custom properties:
```css
:root {
  --sc-tooltip-background: #888;
  --sc-tooltip-color: #eee;
  --sc-tooltip-border-radius: 4px;
  --sc-tooltip-font-size: 12px;
  --sc-tooltip-line-height: 16px;
  --sc-tooltip-padding: 4px 8px;
}
```
