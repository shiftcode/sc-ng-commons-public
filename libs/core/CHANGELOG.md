# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.0.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-core@3.0.0...@shiftcode/ngx-core@4.0.0) (2023-10-19)

### Bug Fixes

- **determine-origin:** ensure no trailing slash in origin ([f8f3171](https://github.com/shiftcode/sc-ng-commons-public/commit/f8f31715a5425a4fc7302c4dfef58e1ea7ef0bcb))

### Code Refactoring

- **modules:** remove deprecated ng modules ([9449828](https://github.com/shiftcode/sc-ng-commons-public/commit/9449828b9bc639e9292979024e1416098a15c80b))

### Features

- **angular:** use angular 16 ([6d34a53](https://github.com/shiftcode/sc-ng-commons-public/commit/6d34a534d7ce2a88f2ecfee6429b226ce493d20b))
- **rxjs:** add observable factory `onDestroy` which uses the new `DestroyRef` ([f8410de](https://github.com/shiftcode/sc-ng-commons-public/commit/f8410de470088619103791b902a39d1ba3c58270))

### BREAKING CHANGES

- **modules:** All ng-module classes have been removed. Import standalone Components/Directives directly.
- **angular:** requires angular@16

# [3.0.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-core@2.0.0...@shiftcode/ngx-core@3.0.0) (2023-05-02)

### Bug Fixes

- **local-storage:** handle when LS is not available ([fb22eee](https://github.com/shiftcode/sc-ng-commons-public/commit/fb22eee39bc4681a921291676c4e226238b1e67d))
- **script-loader-error:** remove property defined in super class ([1ea97f8](https://github.com/shiftcode/sc-ng-commons-public/commit/1ea97f8462dd5c0784af493d5646480d3f841f1b))

### Features

- **angular:** update to angular@15 ([c848401](https://github.com/shiftcode/sc-ng-commons-public/commit/c848401fc4776d87dbbfa3892062f7efefcf742a))
- **client-id.service:** expose information whether clientId was created in current session ([ad94501](https://github.com/shiftcode/sc-ng-commons-public/commit/ad94501785996f96685b74cf6a85a04a220e1fc9))
- **local-storage:** add provide function ([9c5cc2b](https://github.com/shiftcode/sc-ng-commons-public/commit/9c5cc2b21f3cd930d6bf14dab349ea2c8678f2e7))
- **local-storage:** flag indicating whether the real LocalStorage is used ([72cfb45](https://github.com/shiftcode/sc-ng-commons-public/commit/72cfb45504fd2212574d7833ec248380a13d8e0c))
- **log-transport:** new function to provide the log transport with its config to the environment ([5abdfe6](https://github.com/shiftcode/sc-ng-commons-public/commit/5abdfe6fdf7d7383316c31d59bf135680dc07567))
- **logger:** support Feature pattern to provide LogTransports ([9e97248](https://github.com/shiftcode/sc-ng-commons-public/commit/9e972485fed0fabfee6f537357a38b215c5732db))
- **origin:** new environment provider function for the ORIGIN token ([b957ebe](https://github.com/shiftcode/sc-ng-commons-public/commit/b957ebe602924556a60cbcc8f903085a61dc3701))

### BREAKING CHANGES

- **local-storage:** It's necessary to call `provideLocalStorage` or to provide an implementation for LocalStorage on your own
- **origin:** determinateOrigin renamed to determineOrigin
- **angular:** now requires angular@15

# [2.0.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-core@1.1.0...@shiftcode/ngx-core@2.0.0) (2022-10-17)

### Bug Fixes

- **logger-helper:** generate valid hex colors ([9b48ba2](https://github.com/shiftcode/sc-ng-commons-public/commit/9b48ba277bc929e63a246cdaafb6386e7b926ebb))

### Code Refactoring

- **node-console-log-transport:** use colorizeForConsole from @shiftcode/utilities ([e7119f1](https://github.com/shiftcode/sc-ng-commons-public/commit/e7119f1c4777e128016716aaee9140dcf41d92aa))

### Features

- **angular:** update to angular 14.0.0 ([bf3346f](https://github.com/shiftcode/sc-ng-commons-public/commit/bf3346fe8a2004666cc297dff0ab4d56e32a6418))

### BREAKING CHANGES

- **node-console-log-transport:** now requires @shiftcode/utilities@^1.2.0

peer dependency 'ansi-styles' is no longer required

- **angular:** now requires @angular/core@^14.0.0

# [1.1.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-core@1.0.0...@shiftcode/ngx-core@1.1.0) (2022-06-14)

### Features

- **is-input-element:** new helper function ([faebe03](https://github.com/shiftcode/sc-ng-commons-public/commit/faebe03eafccd9cfbc144c8d731c5050d5a4611a))

# 1.0.0 (2022-01-22)

**Note:** Version bump only for package @shiftcode/ngx-core
