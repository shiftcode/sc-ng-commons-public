# One Angular major version per library major version

Each major version of `@shiftcode/ngx-core` and `@shiftcode/ngx-components` targets exactly one Angular major version in its `peerDependencies` (e.g. `^22.0.0`). When Angular bumps its major, the Libraries bump theirs too, and the old Angular version is dropped.

We considered keeping a dual-range like `^21.0.0 || ^22.0.0`, but this forces us to avoid any Angular 22 APIs that aren't available in Angular 21, which defeats the purpose of upgrading. A clean break keeps the maintenance surface small and makes the compatibility contract obvious to Consumers.
