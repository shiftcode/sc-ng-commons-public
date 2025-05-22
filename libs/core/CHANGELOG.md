# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [9.0.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-core@8.0.0...@shiftcode/ngx-core@9.0.0) (2025-05-22)

### Build System

- **core:** update version ([523eab9](https://github.com/shiftcode/sc-ng-commons-public/commit/523eab9cda067c911b0f30eaaa087259ba243885))

### BREAKING CHANGES

- **core:** logGroupName was removed from CloudWatchLogTransportConfig

# [8.0.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-core@7.0.0...@shiftcode/ngx-core@8.0.0) (2025-05-21)

### Bug Fixes

- **cloud-watch-service:** adjust handleRetry logic to retry API ([6aaacd0](https://github.com/shiftcode/sc-ng-commons-public/commit/6aaacd0731ee8e4defded262c361ed21a3fa6a48))
- **cloud-watch-service:** ensure all log events wait for logStream ([dec6eda](https://github.com/shiftcode/sc-ng-commons-public/commit/dec6edadb278e020ebf4856e7b9a83c100087f4e))
- **cloud-watch-service:** improve retry logic for log event sending to avoid race conditions ([57d6058](https://github.com/shiftcode/sc-ng-commons-public/commit/57d6058d6008e1db863a08e9feaca3d8f26fe377))
- **cloud-watch-service:** remove redundant wait call ([235fe64](https://github.com/shiftcode/sc-ng-commons-public/commit/235fe6411c9b525daef398275b68c9aceb913a71))
- **cloud-watch-service:** use retry instead of deprecated retryWhen ([b0a0eed](https://github.com/shiftcode/sc-ng-commons-public/commit/b0a0eedaea5ed6aa2d1eed7394d588945da71c0c))

### Build System

- **deps:** update @shiftcode/logger to version 1.1.0 ([558223d](https://github.com/shiftcode/sc-ng-commons-public/commit/558223de7a250531ce8d1c2cd0f0003f7ad1ee8d))

### Features

- **aws:** update cloud watch service to write logs to APIGateway ([8db28be](https://github.com/shiftcode/sc-ng-commons-public/commit/8db28be48d469ef65d4132442bbdfed510b8fa6b))
- **logger:** implement base logger from @shiftcode/logger ([8561742](https://github.com/shiftcode/sc-ng-commons-public/commit/8561742b0053c5c41a324c8d479d5ea3ebcc0c34))
- update @shiftcode/logger to version ^3.0.0 and @shiftcode/utilities to version ^4.0.0 ([727a2cb](https://github.com/shiftcode/sc-ng-commons-public/commit/727a2cb68d00a0993dfb8a9c755d6c8283aab44f))

### BREAKING CHANGES

- requires @shiftcode/logger ^3.0.0,
  requires @shiftcode/utilities ^4.0.0
- **deps:** Implementing @shiftcode/logger leads to the consumer having to change the imports

# [7.0.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-core@6.0.0...@shiftcode/ngx-core@7.0.0) (2025-01-20)

### Bug Fixes

- **libs:** solve review comments ([1216b96](https://github.com/shiftcode/sc-ng-commons-public/commit/1216b9698f8d9e147accd35853613ac9483b7ccb))
- remove unnecessary eslint rules ([5423000](https://github.com/shiftcode/sc-ng-commons-public/commit/542300063c58fd917a96765304e7e480bcb2f92e))
- revert version of --fix flag command and prettier scripts ([26d0f73](https://github.com/shiftcode/sc-ng-commons-public/commit/26d0f73a07905d6bc1bc29e40b3c0715c6f51d27))
- update sc deps and lint scripts ([64c7e18](https://github.com/shiftcode/sc-ng-commons-public/commit/64c7e18e7bfd8c51489a9670ee6cbf5a059c3af8))

### Features

- **angular:** use angular 19 ([2907ec9](https://github.com/shiftcode/sc-ng-commons-public/commit/2907ec944420ce01e38b11a9e2fb6b03a8543a7f))
- extend eslintrc files ([5bec34b](https://github.com/shiftcode/sc-ng-commons-public/commit/5bec34bbb18006127f13a763dc24a367f7fd6aad))
- **lint:** update eslint configs to only include necessary rules ([21af752](https://github.com/shiftcode/sc-ng-commons-public/commit/21af752ef3e939260bdcd3dbb91fe28098fd81bf))
- remove tslint, add .eslintrc.cjs files ([8bebbd9](https://github.com/shiftcode/sc-ng-commons-public/commit/8bebbd9aa3cd17d8a6e3d7ed8f81bce9147eb87a))
- replace tslint to eslint ([ad6c76c](https://github.com/shiftcode/sc-ng-commons-public/commit/ad6c76cc40b89ab3fd3833dc0e8679a1a2165503))
- **root:** tslint -> eslint and yarn -> npm migrations ([e6c4786](https://github.com/shiftcode/sc-ng-commons-public/commit/e6c47865872529e169848b6f4ea5e421a76a24fb))

### BREAKING CHANGES

- **angular:** requires angular@19

# [6.0.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-core@5.0.1...@shiftcode/ngx-core@6.0.0) (2024-07-13)

### Features

- **angular:** use angular 18 ([4610203](https://github.com/shiftcode/sc-ng-commons-public/commit/46102035f219c1c54cd5799879216cfd3e15f32e))

### BREAKING CHANGES

- **angular:** requires angular@18

## [5.0.1](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-core@5.0.0...@shiftcode/ngx-core@5.0.1) (2024-02-15)

### Bug Fixes

- update version range for rxjs ([b6a8f74](https://github.com/shiftcode/sc-ng-commons-public/commit/b6a8f748168eaeb8079e67e18641fe242692b8cb))

# [5.0.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-core@4.0.0...@shiftcode/ngx-core@5.0.0) (2024-02-13)

### Code Refactoring

- **origin:** remove no longer needed origin providers (`provideOrigin` function) ([c4145cd](https://github.com/shiftcode/sc-ng-commons-public/commit/c4145cd4560d2bdd600559cd66f7e817c78de893))

### Features

- **core:** update angular to version 17 ([1352165](https://github.com/shiftcode/sc-ng-commons-public/commit/1352165888d7488080b6c5297f3c33fdee5af819))
- **resolve-fn-to-can-activate-fn:** new utility to transform a ResolveFn to a CanActivateFn ([40cd715](https://github.com/shiftcode/sc-ng-commons-public/commit/40cd7153dbaecc8faf68d973980fb6c80c89a9bf))
- **to-promise:** static util function to ensure returned value is a promise ([5e89db0](https://github.com/shiftcode/sc-ng-commons-public/commit/5e89db0541c70f383c9ed4f3ccecd063abc2a3f7))

### BREAKING CHANGES

- **origin:** for ssr use `@angular/ssr` and refactor accordingly
- **core:** requires angular 17.1.1 as a peer dependency

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
