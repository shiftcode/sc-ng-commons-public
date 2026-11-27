---
applyTo: '**/*.ts'
---

# TypeScript instructions

- use `interface` over `type` alias.
- Strict types: `unknown` over `any`
- Explicit return types unless TypeScript infers a complex, parameter-dependent type that would be impractical or less precise to annotate explicitly
- `satisfies` + `keyof` for string-keyed object access, e.g. `'externalCostOf.id' satisfies KeyOrNestedOf<ExternalCostDto>`.
- `enum` for meaningful value sets, `ALL_CAPS` keys — not string unions.
- No barrel files (`index.ts`) unless used for package.js entry points / exports.
