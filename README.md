# sc-ng-commons-public

Public Angular libraries used in various shiftcode projects.

> [![@shiftcode/ngx-core](https://img.shields.io/github/package-json/v/shiftcode/sc-ng-commons-public?filename=%2Flibs%2Fcore%2Fpackage.json&label=%40shiftcode%2Fngx-core)](libs/core)\
> Core Utilities; mainly services and some helper functions and rxjs operators. More details in [README](./libs/core/README.md).

> [![@shiftcode/ngx-aws](https://img.shields.io/github/package-json/v/shiftcode/sc-ng-commons-public?filename=%2Flibs%2Faws%2Fpackage.json&label=%40shiftcode%2Fngx-aws)](libs/aws)\
> Angular Services working with AWS. More details in [README](./libs/aws/README.md).

> [![@shiftcode/ngx-components](https://img.shields.io/github/package-json/v/shiftcode/sc-ng-commons-public?filename=%2Flibs%2Fcomponents%2Fpackage.json&label=%40shiftcode%2Fngx-components)](libs/components)\
> Angular components/directives/pipes usable across different projects. More details in [README](./libs/components/README.md).

> ![@shiftcode/ngx-ssr](https://img.shields.io/badge/@shiftcode/ngx--ssr-deprecated-f48700)\
> Not used anymore starting with Angular 17. See necessary changes in [ssr.md](./ssr.md)

## Angular to Lib Version Mapping
Shows the mapping between the angular version and our lib versions.

| Angular Version | Lib Version |
|-----------------|-------------|
| `^19`           | `^7`        | 
| `^18`           | `^6`        | 
| `^17`           | `^5`        |
| `^16`           | `^4`        |
| `^15`           | `^3`        |
| `^14`           | `^2`        |
| `^13`           | `^1`        |


## Anatomy of this workspace
Package manager client: `npm`

Individual packages can depend on each other, the dependency is resolved using ts paths (see ./tsconfig.json) make sure to build the package you depend on. Or change the tsconfig.paths to reference the files under `src` directory.

Lerna is used to publish the packages and to run commands in multiple packages.


## Dependencies
All dependencies of a library are defined as peerDependencies (except tslib)
### root dependencies + libs peerDependencies
When adding a peerDependency it must also be added to the root package.json as 'normal' dependency.

## Versioning
When opening a PR lerna publishes a new prerelease version with the preId `-prXX.{COUNT}`.
By creating this version lerna creates a commit with the updated versions in the package.json. It does not update the PeerDependencies versions.

After merging the PR back to the master a new release is published with the graduated version (eg. `1.0.1-pr55.7` -> `1.0.1`).

### Hint
If it happens that you already have another commit locally, before updating the branch with this `build(release):..` commit:
> use `rebase` instead of `merge`

## Add new library
1. run `ng generate library my-lib`
2. change `libs/my-lib/package.json#name` to `@shiftcode/ngx-my-lib`
3. alter `libs/my-lib/ng-package.json#dest` to `./dist`
4. add `"assets": [ "LICENSE", "CHANGELOG.md" ],` to `libs/my-lib/ng-package.json`
5. alter `tsconfig.json#compilerOptions.paths` `my-lib` entry to `@shifcode/ng-my-lib` and edit paths according to #3
6. update tsconfig files like other libs
7. change from karma config to jest:
  1. remove `libs/my-lib/src/test.ts`
  2. remove `libs/my-lib/karam-config.js`
  3. in `angular.json` replace the libs test architect to `"test": { "builder": "@angular-builders/jest:run" }`

