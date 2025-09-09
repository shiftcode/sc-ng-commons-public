# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [12.0.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-components@11.0.0...@shiftcode/ngx-components@12.0.0) (2025-09-09)

### Features

- **dependencies:** require @shiftcode/ngx-core@^12.0.0 ([5c93d4b](https://github.com/shiftcode/sc-ng-commons-public/commit/5c93d4bdfd9cada0c76f9eecbb4d4e358f163199))
- **dependencies:** use @shiftcode/ngx-core@^12.0.0 ([8a75739](https://github.com/shiftcode/sc-ng-commons-public/commit/8a75739de97439247307d4e99a7cb640d0212c10))

### BREAKING CHANGES

- **dependencies:** require @shiftcode/ngx-core@^12.0.0

# [11.0.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-components@10.0.0...@shiftcode/ngx-components@11.0.0) (2025-06-30)

### Bug Fixes

- remove our ng-dev-mode type, since this is no part of @angular/core ([ba7a44f](https://github.com/shiftcode/sc-ng-commons-public/commit/ba7a44f2ed02efcf2eb203a21d9b2a4ce3d737ca))

### Features

- **components:** update to angular 20 ([6188a11](https://github.com/shiftcode/sc-ng-commons-public/commit/6188a1104053a9d0c5c5b4f894cc13b8c27aa2da))
- run @angular/core:inject migration ([dafceb0](https://github.com/shiftcode/sc-ng-commons-public/commit/dafceb0c74a8559c7cd3c3e3d267c0b57393e383))
- update to angular 20 ([0ff5267](https://github.com/shiftcode/sc-ng-commons-public/commit/0ff5267a5e666153a4714bd80978a0a944f486a0))

### BREAKING CHANGES

- **components:** Requires Angular ^20
- Requires Angular ^20

# [10.0.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-components@9.0.0...@shiftcode/ngx-components@10.0.0) (2025-06-30)

### Build System

- **components:** update peer dependency version ([1bdcbac](https://github.com/shiftcode/sc-ng-commons-public/commit/1bdcbacbb83b270daf35026134961afc2bc6d59c))

### BREAKING CHANGES

- **components:** requires @shiftcode/ngx-core ^10.0.0

# [9.0.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-components@8.0.0...@shiftcode/ngx-components@9.0.0) (2025-05-22)

### Build System

- **components:** update @shiftcode/ngx-core version to ^9.0.0 || ^9.0.0-pr46 ([1f167b0](https://github.com/shiftcode/sc-ng-commons-public/commit/1f167b0fa500c3f81d1ce429d222dd29b219c358))

### BREAKING CHANGES

- **components:** requires @shiftcode/ngx-core version to ^9.0.0

# [8.0.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-components@7.0.0...@shiftcode/ngx-components@8.0.0) (2025-05-21)

### Build System

- **deps:** update @shiftcode/logger to version 1.1.0 ([558223d](https://github.com/shiftcode/sc-ng-commons-public/commit/558223de7a250531ce8d1c2cd0f0003f7ad1ee8d))

### Features

- **aws/components:** update to ngx-core^7.1.0 ([f89cc4b](https://github.com/shiftcode/sc-ng-commons-public/commit/f89cc4be66f3d2441a06328334691015da996cd0))
- **logger:** implement base logger from @shiftcode/logger ([8561742](https://github.com/shiftcode/sc-ng-commons-public/commit/8561742b0053c5c41a324c8d479d5ea3ebcc0c34))
- update @shiftcode/logger to version ^3.0.0 and @shiftcode/utilities to version ^4.0.0 ([727a2cb](https://github.com/shiftcode/sc-ng-commons-public/commit/727a2cb68d00a0993dfb8a9c755d6c8283aab44f))

### BREAKING CHANGES

- requires @shiftcode/logger ^3.0.0,
  requires @shiftcode/utilities ^4.0.0
- **deps:** Implementing @shiftcode/logger leads to the consumer having to change the imports

# [7.0.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-components@6.1.0...@shiftcode/ngx-components@7.0.0) (2025-01-20)

### Bug Fixes

- add essential ts-ignores ([197606f](https://github.com/shiftcode/sc-ng-commons-public/commit/197606f7412314f030290e6a927884b653fb6d46))
- **aws:** update nx-components version ([803591d](https://github.com/shiftcode/sc-ng-commons-public/commit/803591dccfba4b143b97a62d7e7aa8677efe0c9f))
- **components:** update ngx-core ([70d927c](https://github.com/shiftcode/sc-ng-commons-public/commit/70d927ce9dc1fc302922f9969d181d207bbd4f4c))
- **libs:** solve review comments ([1216b96](https://github.com/shiftcode/sc-ng-commons-public/commit/1216b9698f8d9e147accd35853613ac9483b7ccb))
- remove unnecessary eslint rules ([5423000](https://github.com/shiftcode/sc-ng-commons-public/commit/542300063c58fd917a96765304e7e480bcb2f92e))
- revert version of --fix flag command and prettier scripts ([26d0f73](https://github.com/shiftcode/sc-ng-commons-public/commit/26d0f73a07905d6bc1bc29e40b3c0715c6f51d27))

### Features

- **angular:** use angular 19 ([2907ec9](https://github.com/shiftcode/sc-ng-commons-public/commit/2907ec944420ce01e38b11a9e2fb6b03a8543a7f))
- extend eslintrc files ([5bec34b](https://github.com/shiftcode/sc-ng-commons-public/commit/5bec34bbb18006127f13a763dc24a367f7fd6aad))
- **lint:** update eslint configs to only include necessary rules ([21af752](https://github.com/shiftcode/sc-ng-commons-public/commit/21af752ef3e939260bdcd3dbb91fe28098fd81bf))
- remove tslint, add .eslintrc.cjs files ([8bebbd9](https://github.com/shiftcode/sc-ng-commons-public/commit/8bebbd9aa3cd17d8a6e3d7ed8f81bce9147eb87a))
- replace tslint to eslint ([ad6c76c](https://github.com/shiftcode/sc-ng-commons-public/commit/ad6c76cc40b89ab3fd3833dc0e8679a1a2165503))
- **root:** migrate to npm ([94a6d6d](https://github.com/shiftcode/sc-ng-commons-public/commit/94a6d6d7e75b33ceebddcde3e5f08a23858e676d))
- **root:** tslint -> eslint and yarn -> npm migrations ([e6c4786](https://github.com/shiftcode/sc-ng-commons-public/commit/e6c47865872529e169848b6f4ea5e421a76a24fb))

### BREAKING CHANGES

- **angular:** requires angular@19

# [6.1.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-components@6.0.0...@shiftcode/ngx-components@6.1.0) (2024-08-23)

### Features

- **svg-component:** change log level in case of no internet ([b644f4c](https://github.com/shiftcode/sc-ng-commons-public/commit/b644f4c2c4df1474b07d19cc64e4a76986490345))

# [6.0.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-components@5.0.1...@shiftcode/ngx-components@6.0.0) (2024-07-13)

### Features

- **angular:** use angular 18 ([4610203](https://github.com/shiftcode/sc-ng-commons-public/commit/46102035f219c1c54cd5799879216cfd3e15f32e))

### BREAKING CHANGES

- **angular:** requires angular@18

## [5.0.1](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-components@5.0.0...@shiftcode/ngx-components@5.0.1) (2024-02-15)

### Bug Fixes

- update version range for rxjs ([b6a8f74](https://github.com/shiftcode/sc-ng-commons-public/commit/b6a8f748168eaeb8079e67e18641fe242692b8cb))

# [5.0.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-components@4.0.0...@shiftcode/ngx-components@5.0.0) (2024-02-13)

### Bug Fixes

- **tooltip:** update source to satisfy constraints from super class ([118ba89](https://github.com/shiftcode/sc-ng-commons-public/commit/118ba89a55e88defdd9e04c7a360f0db461b5ddb))

### Code Refactoring

- **dependencies:** add @angular/router to peer dependencies ([0251132](https://github.com/shiftcode/sc-ng-commons-public/commit/0251132a0ebf2bfbe7f14734fb43568f5b401bee))

### Features

- **components:** update angular to version 17 ([c07933d](https://github.com/shiftcode/sc-ng-commons-public/commit/c07933ddb30658e1798a456ba77ee439c3fb6772))
- **navigation-class-handler:** new utility to add/remove a css class on the body while navigating ([6dd1466](https://github.com/shiftcode/sc-ng-commons-public/commit/6dd14668c9b146f4645b3ebc5b2a50d9d7dc6345))

### BREAKING CHANGES

- **dependencies:** requires the `@angular/router` as peer dependency
- **components:** requires angular 17.1.1 as a peer dependency

# [4.0.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-components@3.0.0...@shiftcode/ngx-components@4.0.0) (2023-10-19)

### Bug Fixes

- **click-outside.directive:** make it work ([1c3a49b](https://github.com/shiftcode/sc-ng-commons-public/commit/1c3a49ba38191e8b5c176122253c4218ab1b00c3))

### Code Refactoring

- **flying-focus:** use inject() ([d62d011](https://github.com/shiftcode/sc-ng-commons-public/commit/d62d0118501d27bcd48503aeefe7c734f3815627))
- **modules:** remove deprecated ng modules ([9449828](https://github.com/shiftcode/sc-ng-commons-public/commit/9449828b9bc639e9292979024e1416098a15c80b))
- **svg.component:** make url input required ([8b518aa](https://github.com/shiftcode/sc-ng-commons-public/commit/8b518aa264b125c60d1f8a969a11a1160d18128b))

### Features

- **angular:** use angular 16 ([6d34a53](https://github.com/shiftcode/sc-ng-commons-public/commit/6d34a534d7ce2a88f2ecfee6429b226ce493d20b))
- **insert-view-ref.directive:** add public `insert` and `detach` methods + `hasAttachedView` getter ([69b0c83](https://github.com/shiftcode/sc-ng-commons-public/commit/69b0c83daeaaf18ddade008da7f624b790df07fb))
- **rx-let:** rx-angular inspired directive ([1edf9cc](https://github.com/shiftcode/sc-ng-commons-public/commit/1edf9cc3bab763bcdf7b46bb250d29b095584e03))
- **sc-rx-if.directive:** new directive for if/else with observables ([6b0834f](https://github.com/shiftcode/sc-ng-commons-public/commit/6b0834f8271554a0dc600f97ee996d1ea4d14c44))

### BREAKING CHANGES

- **modules:** All ng-module classes have been removed. Import standalone Components/Directives directly.
- **svg.component:** url input now required for sc-svg component
- **flying-focus:** all constructor arguments removed
- **click-outside.directive:** scClickOutside directive API change
  no longer supports [scClickOutside] boolean input for activation but `[scClickOutsideDisabled]` for disabling
- **angular:** requires angular@16

# [3.0.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-components@2.0.0...@shiftcode/ngx-components@3.0.0) (2023-05-02)

### Bug Fixes

- **svg-registry:** remove svg request from cache when timed out ([795f8a3](https://github.com/shiftcode/sc-ng-commons-public/commit/795f8a3892e18a833b907c9ee0f7b03875dfeca5))
- **tooltip:** register touch events as passive listeners ([eda8376](https://github.com/shiftcode/sc-ng-commons-public/commit/eda837617130ac519d1d686623d08cf83e002725))

### Code Refactoring

- **svg:** remove constructor arguments ([c3173ae](https://github.com/shiftcode/sc-ng-commons-public/commit/c3173ae9f096729b6653e8e1955e1cef76763a1b))

### Features

- **angular:** update to angular@15 ([c848401](https://github.com/shiftcode/sc-ng-commons-public/commit/c848401fc4776d87dbbfa3892062f7efefcf742a))
- **auto-focus:** make directive standalone ([4ec0f7b](https://github.com/shiftcode/sc-ng-commons-public/commit/4ec0f7b752cf9f0dcf0cf55a7a86dc63d7673a1d))
- **button:** emit actual event in action output ([9ae67d4](https://github.com/shiftcode/sc-ng-commons-public/commit/9ae67d47e899d4af31b0a559745d11e2d150ffb8))
- **button:** make component standalone ([1596a62](https://github.com/shiftcode/sc-ng-commons-public/commit/1596a62beac6f568616e6a456f022b67c624debe))
- **click-outside:** make directive standalone ([5402c11](https://github.com/shiftcode/sc-ng-commons-public/commit/5402c11d3d155a2df3768eb55465fa0a848a0eeb))
- **flying-focus:** make component standalone ([0499d43](https://github.com/shiftcode/sc-ng-commons-public/commit/0499d43b94bd72a30441dc4a5eea4b7ddba0385b))
- **insert-view-ref.directive:** add new directive ([c9367d2](https://github.com/shiftcode/sc-ng-commons-public/commit/c9367d2d784c8c1bc239bdc1236fb7aa332f84be))
- **smooth-height:** make component standalone ([d521472](https://github.com/shiftcode/sc-ng-commons-public/commit/d521472f96ff987247c9b834ab23826219f87ee8))
- **svg-animate:** make directive standalone ([d7a92f3](https://github.com/shiftcode/sc-ng-commons-public/commit/d7a92f3f8063c08a586bfc824fcebcef20a8948c))
- **svg:** make component standalone ([337a091](https://github.com/shiftcode/sc-ng-commons-public/commit/337a091b2f4408e9d655523ff223d424d2b01d83))
- **textarea-autosize:** make directive standalone ([dba48be](https://github.com/shiftcode/sc-ng-commons-public/commit/dba48beb0c08988683b6c1231901091194480725))
- **tooltip.directive:** make standalone ([de18daf](https://github.com/shiftcode/sc-ng-commons-public/commit/de18dafdbabc526a9e76646fe7d5d67aa350f3cb))

### BREAKING CHANGES

- **svg:** SvgComponent no longer requires any constructor arguments. Only applies when extending the SvgComponent
- **angular:** now requires angular@15

# [2.0.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-components@1.2.1...@shiftcode/ngx-components@2.0.0) (2022-10-17)

### Features

- **angular:** update to angular 14.0.0 ([bf3346f](https://github.com/shiftcode/sc-ng-commons-public/commit/bf3346fe8a2004666cc297dff0ab4d56e32a6418))

### BREAKING CHANGES

- **angular:** now requires @angular/core@^14.0.0

## [1.2.1](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-components@1.2.0...@shiftcode/ngx-components@1.2.1) (2022-06-14)

### Bug Fixes

- **auto-focus-directive:** use ngAfterViewInit lifecycle hook to focus the element ([fdbaa72](https://github.com/shiftcode/sc-ng-commons-public/commit/fdbaa729922ea0dc1c3ab612c03cf0815c1d7d16))
- **auto-focus.directive:** no longer set tabindex=-1 when element is already focusable ([1aa4706](https://github.com/shiftcode/sc-ng-commons-public/commit/1aa4706f7de0ba92313a8aa48f1cee09f8d0aaa4))
- **autofocus-directive:** no longer set tabindex=-1 when element is already focusable ([4725ea4](https://github.com/shiftcode/sc-ng-commons-public/commit/4725ea4fa6ad3b090a63abde81a949a4113d4f2a))

# [1.2.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-components@1.1.0...@shiftcode/ngx-components@1.2.0) (2022-06-13)

### Features

- **tooltip:** use css custom prop for padding ([bb0ea75](https://github.com/shiftcode/sc-ng-commons-public/commit/bb0ea7556c171d0e261603baf1a00850a5784c8e))

# [1.1.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-components@1.0.0...@shiftcode/ngx-components@1.1.0) (2022-05-13)

### Features

- **svg-animate.directive:** add directive to animate svgs ([d8115fc](https://github.com/shiftcode/sc-ng-commons-public/commit/d8115fcfb5524a98a4e81ee65c77c17c2731c452))

# 1.0.0 (2022-01-22)

**Note:** Version bump only for package @shiftcode/ngx-components
