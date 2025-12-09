# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 13.0.0 (2025-12-09)

### Bug Fixes

- **click-outside.directive:** make it work ([1c3a49b](https://github.com/shiftcode/sc-ng-commons-public/commit/1c3a49ba38191e8b5c176122253c4218ab1b00c3))
- **local-storage:** handle when LS is not available ([fb22eee](https://github.com/shiftcode/sc-ng-commons-public/commit/fb22eee39bc4681a921291676c4e226238b1e67d))
- remove our ng-dev-mode type, since this is no part of @angular/core ([ba7a44f](https://github.com/shiftcode/sc-ng-commons-public/commit/ba7a44f2ed02efcf2eb203a21d9b2a4ce3d737ca))

### Code Refactoring

- **smooth-height:** use native animation and MutationObserver ([f366f81](https://github.com/shiftcode/sc-ng-commons-public/commit/f366f81496a7ce67d6a19d3e00caa510a32bf330))

### Features

- **angular:** update to angular 14.0.0 ([bf3346f](https://github.com/shiftcode/sc-ng-commons-public/commit/bf3346fe8a2004666cc297dff0ab4d56e32a6418))
- **angular:** update to angular@15 ([c848401](https://github.com/shiftcode/sc-ng-commons-public/commit/c848401fc4776d87dbbfa3892062f7efefcf742a))
- **angular:** use angular 19 ([2907ec9](https://github.com/shiftcode/sc-ng-commons-public/commit/2907ec944420ce01e38b11a9e2fb6b03a8543a7f))
- **logger:** implement base logger from @shiftcode/logger ([8561742](https://github.com/shiftcode/sc-ng-commons-public/commit/8561742b0053c5c41a324c8d479d5ea3ebcc0c34))
- **logger:** support Feature pattern to provide LogTransports ([9e97248](https://github.com/shiftcode/sc-ng-commons-public/commit/9e972485fed0fabfee6f537357a38b215c5732db))
- **navigation-class-handler:** styleguide page ([d531901](https://github.com/shiftcode/sc-ng-commons-public/commit/d5319011d9e43e1d440522605a0a5116e48dfc5f))
- replace tslint to eslint ([ad6c76c](https://github.com/shiftcode/sc-ng-commons-public/commit/ad6c76cc40b89ab3fd3833dc0e8679a1a2165503))
- **root:** tslint -> eslint and yarn -> npm migrations ([e6c4786](https://github.com/shiftcode/sc-ng-commons-public/commit/e6c47865872529e169848b6f4ea5e421a76a24fb))
- run @angular/core:inject migration ([dafceb0](https://github.com/shiftcode/sc-ng-commons-public/commit/dafceb0c74a8559c7cd3c3e3d267c0b57393e383))
- **styleguide:** remove node console transport ([bb396fb](https://github.com/shiftcode/sc-ng-commons-public/commit/bb396fb423e7b66a1da7a7b440d5729128e9a6c7))
- **tooltip:** use css custom prop for padding ([bb0ea75](https://github.com/shiftcode/sc-ng-commons-public/commit/bb0ea7556c171d0e261603baf1a00850a5784c8e))
- update to angular 20 ([0ff5267](https://github.com/shiftcode/sc-ng-commons-public/commit/0ff5267a5e666153a4714bd80978a0a944f486a0))
- update to angular 21 ([b6940b5](https://github.com/shiftcode/sc-ng-commons-public/commit/b6940b5869c834ebbe463cf958c3ecbebb414cb1))
- update to angular17 (@angular/core) ([858c2e9](https://github.com/shiftcode/sc-ng-commons-public/commit/858c2e9665096fba7695bb92106eb4b66b8c73b9))

### BREAKING CHANGES

- **smooth-height:** no more `trigger` input for `smooth-height` component. instead a MutationObserver is used
- Requires Angular ^21
- Requires Angular ^20
- **angular:** requires angular@19
- Requires angular@^17.1.1 to be installed
- **click-outside.directive:** scClickOutside directive API change
  no longer supports [scClickOutside] boolean input for activation but `[scClickOutsideDisabled]` for disabling
- **local-storage:** It's necessary to call `provideLocalStorage` or to provide an implementation for LocalStorage on your own
- **angular:** now requires angular@15
- **angular:** now requires @angular/core@^14.0.0
