# rxLet + RxIf Directives

The `scRxIf` & `scRxLet` directives serves a convenient way of binding Observables/Promises to a view context (DOM element's scope).

## Why

### Performance

opposed to `ngIf` + `async` pipe, which triggers CD on the whole component for each emission, `scRxLet`+`scRxIf` only checks the template itself

### Convenience

```html
<p class="items-count" *ngIf="count$ | async as count">There are {{ count }} items</p>
```

The problem is that `*ngIf` is interfering with rendering. In case of 0 (falsy value), the `p.items-count` would be hidden.

> instead of wrapping a potential falsy value into an object you can use \*scRxLet

### Error Handling

Both Directives will render the provided Error-Template in case of errors

## `scRxIf` vs. `scRxLet`

`scRxIf` will render the view only with a truthy value and handles

- a falsy value emission
- AND the suspense state (=no emission or not resolved) of the observable/Promise
  both with the `else` template (if provided)

While the `scRxLet` will

- renders the view with _any_ emitted value (no matter whether it's falsy or not)
- renders a globally defined or per-case-provided suspense component/template (e.g. Loader)

## Usage

- [sc-rx-let](./rx-let.directive.ts)
- [sc-rx-if](./rx-if.directive.ts)

## Drawbacks

As both directive won't trigger CD on outer component when new values are emitted, potential View/Content Queries won't be updated
