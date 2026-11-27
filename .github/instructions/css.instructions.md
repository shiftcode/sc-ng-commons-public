---
applyTo: '**/*.{css,scss}'
---

# CSS/SCSS styling instructions

- Use block/element/modifier naming (`.component`, `.component__part`, `.component__part--state`) - nesting parts is not allowed, rather name them as own part.
- Don’t use `&` to build class names like `&__label`; it’s fine to use `&` for selector composition like `&:hover`
- Keep state selectors explicit with attributes/pseudo classes (`[aria-disabled='true']`, `[data-invalid]`, `:focus-visible`).
- Use logical properties (`padding-inline`, `margin-block`, `start`, `end`)
- Prefer container-based layout with flex/grid gaps for spacing, rather than margins/paddings
- Use container queries in components rather than media queries
- Use `::ng-deep` only when required to style content rendered outside component encapsulation (for example portal/dropdown overlays). Keep such rules scoped and documented briefly.
- Keep transitions/animations minimal and purposeful; use short durations and only animate appropriate properties.
- Co-locate style comments only when they explain non-obvious intent or framework constraints; avoid redundant comments.
