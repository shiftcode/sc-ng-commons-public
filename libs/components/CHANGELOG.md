# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
