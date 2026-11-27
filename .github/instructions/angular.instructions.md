---
applyTo: '{apps,libs}/*/src/**/*.{ts,html}'
---

# Angular instructions

- Use the angular MCP to ensure best practices are applied.
- put template and styles in their of files, do not inline them unless it's a very small snippet.
- Use signal-based APIs (`input`, `output`, `model`, `computed`, `viewChild`(ren), `contentChild`(ren)) over legacy decorator and constructor patterns.
- use `signal` and `computed` for state that is effect or template relevant. do not mutate signal values, use `set` or `update` and treat values as immutable.
- Avoid using method based lifecycle hooks (`ngOnInit`, `ngOnDestroy`, etc.) in favor of signal-based/functional APIs `effect`, `afterRenderEffect`, `afterNextRender`.
  Use `onInit` from `@shiftcode/ngx-core` if you need to run code once on component initialization; it handles a potential callback return fn as cleanup that replaces `ngOnDestroy`.
- Avoid naming Angular component or directive inputs after native HTML attributes that have visual or semantic representation, such as `title`, `hidden`, `content`, `style`, or `class`. Prefer alternative names, such as `heading` instead of `title`, `isHidden` instead of `hidden`, and `contentText` instead of `content`.
- Boolean inputs should always express the opposite of the default state, have `false` as default value and use the `booleanAttribute` transform function: e.g. `readonly skipLink = input(false, { transform: booleanAttribute })`.
- In reactive-form templates, do not use `formControlName`, `formArrayName`, or `formGroupName`; always bind controls directly with `[formControl]`, for example `[formControl]="group.controls.format"`.
- For services/components/directives that log, use `private readonly logger = inject(LoggerService).getInstance('ClassName')` from `@shiftcode/ngx-core`.
