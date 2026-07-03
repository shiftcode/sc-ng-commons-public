# sc-ng-commons-public

A public Angular utility monorepo that publishes reusable libraries for Angular applications. It contains publishable libraries and a non-publishable styleguide app.

## Language

**Library**:
A publishable npm package (`@shiftcode/ngx-core`, `@shiftcode/ngx-components`) that ships Angular utilities for external consumption.
_Avoid_: Package, module, plugin

**Consumer**:
An external Angular application or library that declares one of the Libraries as a dependency.
_Avoid_: User, client, app

**Styleguide**:
The non-published Angular application in `apps/styleguide` used to develop and showcase Library features.
_Avoid_: Demo app, example app

**Angular Version Support**:
The Angular version range a given Library version declares support for, expressed via `peerDependencies`. Changing this boundary (e.g. dropping Angular 21 support) is a breaking change for Consumers.
_Avoid_: Compatibility Boundary
