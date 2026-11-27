---
applyTo: '**/*.{spec,test}.ts'
---

# Unit/integration testing instructions

- Use **Vitest** (`describe`, `test`, `expect`, `vi`) and import test APIs from `vitest`.
- Keep test setups in local `setup(...)` helpers to reduce duplication. make them configurable if useful.
- Prefer focused nested `describe(...)` blocks by behavior (for example: initial state, interactions, edge cases).
- Name test cases by expected behavior (`test('updates model signal when an option is clicked', ...)` style).
- Prefer semantic assertions over implementation details; assert (rendered) output rather than specific state on instances.
- Prefer Vitest fixtures (`test.extend`) over `beforeEach`/`afterEach` for reusable setup and teardown;
- Use snapshot tests for large structured output (complex objects, HTML) where manual assertions would be tedious or fragile; prefer `toMatchObject` when it is sufficient.
- Use `test.each` for data-driven tests.
- Use `expect.soft` when later assertions should still run after a failure.
- Use `expect.poll` sparingly, only for assertions that must be retried until they pass.
- Use asymmetric matchers (`expect.any`, `expect.objectContaining`, `expect.arrayContaining`, `expect.closeTo`) for values that are not deterministic.
- Use `expectTypeOf` / `assertType` to test types where type correctness matters and the project is configured for type testing.
