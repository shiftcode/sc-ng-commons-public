# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 13.0.0 (2025-12-09)

### Bug Fixes

- add essential ts-ignores ([197606f](https://github.com/shiftcode/sc-ng-commons-public/commit/197606f7412314f030290e6a927884b653fb6d46))
- **angular:** use and require version with fixed xss gap ([6c23165](https://github.com/shiftcode/sc-ng-commons-public/commit/6c23165a80009faf50076d8e8320f89ff97df372))
- **auto-focus-directive:** use ngAfterViewInit lifecycle hook to focus the element ([fdbaa72](https://github.com/shiftcode/sc-ng-commons-public/commit/fdbaa729922ea0dc1c3ab612c03cf0815c1d7d16))
- **auto-focus.directive:** no longer set tabindex=-1 when element is already focusable ([1aa4706](https://github.com/shiftcode/sc-ng-commons-public/commit/1aa4706f7de0ba92313a8aa48f1cee09f8d0aaa4))
- **autofocus-directive:** no longer set tabindex=-1 when element is already focusable ([4725ea4](https://github.com/shiftcode/sc-ng-commons-public/commit/4725ea4fa6ad3b090a63abde81a949a4113d4f2a))
- **aws:** update ngx-core ([aa9741e](https://github.com/shiftcode/sc-ng-commons-public/commit/aa9741ef53c1269c818e246f52cb74452880a3c9))
- **aws:** update ngx-core ([4867aeb](https://github.com/shiftcode/sc-ng-commons-public/commit/4867aeb7ebf83dc604e0410a34f9f290e876681f))
- **aws:** update nx-components version ([803591d](https://github.com/shiftcode/sc-ng-commons-public/commit/803591dccfba4b143b97a62d7e7aa8677efe0c9f))
- **click-outside.directive:** make it work ([1c3a49b](https://github.com/shiftcode/sc-ng-commons-public/commit/1c3a49ba38191e8b5c176122253c4218ab1b00c3))
- **cloud-watch-service:** adjust handleRetry logic to retry API ([6aaacd0](https://github.com/shiftcode/sc-ng-commons-public/commit/6aaacd0731ee8e4defded262c361ed21a3fa6a48))
- **cloud-watch-service:** ensure all log events wait for logStream ([dec6eda](https://github.com/shiftcode/sc-ng-commons-public/commit/dec6edadb278e020ebf4856e7b9a83c100087f4e))
- **cloud-watch-service:** improve retry logic for log event sending to avoid race conditions ([57d6058](https://github.com/shiftcode/sc-ng-commons-public/commit/57d6058d6008e1db863a08e9feaca3d8f26fe377))
- **cloud-watch-service:** remove redundant wait call ([235fe64](https://github.com/shiftcode/sc-ng-commons-public/commit/235fe6411c9b525daef398275b68c9aceb913a71))
- **cloud-watch-service:** use retry instead of deprecated retryWhen ([b0a0eed](https://github.com/shiftcode/sc-ng-commons-public/commit/b0a0eedaea5ed6aa2d1eed7394d588945da71c0c))
- **cloudwatch-logger:** assign Observable to logStream so log stream is created ([3b19a06](https://github.com/shiftcode/sc-ng-commons-public/commit/3b19a06b5f0c0030a988a3868fad5ba3badfcb49))
- **cloudwatch-logger:** make logStream Observable always emit ([ad97f42](https://github.com/shiftcode/sc-ng-commons-public/commit/ad97f429788e60512aa4e0f81c26469e0163af66))
- **cloudwatch-logger:** use http client for log put due to beacon API not supporting wildcard CORS ([1108006](https://github.com/shiftcode/sc-ng-commons-public/commit/11080061282e64df20773d130f219e897441dc43))
- **components:** update ngx-core ([70d927c](https://github.com/shiftcode/sc-ng-commons-public/commit/70d927ce9dc1fc302922f9969d181d207bbd4f4c))
- **core:** also allow undefined for log request info values ([5f6e51d](https://github.com/shiftcode/sc-ng-commons-public/commit/5f6e51dbabeefbe3438d047a05b2223962cad293))
- **core:** remove self reference in import ([bc7a1af](https://github.com/shiftcode/sc-ng-commons-public/commit/bc7a1af281dd3438d6cdeb56cde58dabcd3ce6d8))
- **determine-origin:** ensure no trailing slash in origin ([f8f3171](https://github.com/shiftcode/sc-ng-commons-public/commit/f8f31715a5425a4fc7302c4dfef58e1ea7ef0bcb))
- **libs:** solve review comments ([1216b96](https://github.com/shiftcode/sc-ng-commons-public/commit/1216b9698f8d9e147accd35853613ac9483b7ccb))
- **local-storage:** handle when LS is not available ([fb22eee](https://github.com/shiftcode/sc-ng-commons-public/commit/fb22eee39bc4681a921291676c4e226238b1e67d))
- **logger-helper:** generate valid hex colors ([9b48ba2](https://github.com/shiftcode/sc-ng-commons-public/commit/9b48ba277bc929e63a246cdaafb6386e7b926ebb))
- **logger:** ensure `requestInfo` is optional in log data and improve injection syntax ([91f9bb9](https://github.com/shiftcode/sc-ng-commons-public/commit/91f9bb9abffbb4f69b39d586cf02955e820b8cfc))
- **logger:** make the `LogRequestInfo` feature working again ([0e3d49d](https://github.com/shiftcode/sc-ng-commons-public/commit/0e3d49d6df80a866cc67c7c3973b75182c93d65f))
- package-lock.json ([871ec8f](https://github.com/shiftcode/sc-ng-commons-public/commit/871ec8f978fdc881cd94bbcd96fb06320354e354))
- remove our ng-dev-mode type, since this is no part of @angular/core ([ba7a44f](https://github.com/shiftcode/sc-ng-commons-public/commit/ba7a44f2ed02efcf2eb203a21d9b2a4ce3d737ca))
- remove unnecessary eslint rules ([5423000](https://github.com/shiftcode/sc-ng-commons-public/commit/542300063c58fd917a96765304e7e480bcb2f92e))
- revert version of --fix flag command and prettier scripts ([26d0f73](https://github.com/shiftcode/sc-ng-commons-public/commit/26d0f73a07905d6bc1bc29e40b3c0715c6f51d27))
- **root:** update lock file ([d065241](https://github.com/shiftcode/sc-ng-commons-public/commit/d0652410ed403ab58cb680d95d46d6a542ddf741))
- **script-loader-error:** remove property defined in super class ([1ea97f8](https://github.com/shiftcode/sc-ng-commons-public/commit/1ea97f8462dd5c0784af493d5646480d3f841f1b))
- **svg-registry:** remove svg request from cache when timed out ([795f8a3](https://github.com/shiftcode/sc-ng-commons-public/commit/795f8a3892e18a833b907c9ee0f7b03875dfeca5))
- **tooltip:** register touch events as passive listeners ([eda8376](https://github.com/shiftcode/sc-ng-commons-public/commit/eda837617130ac519d1d686623d08cf83e002725))
- **tooltip:** update source to satisfy constraints from super class ([118ba89](https://github.com/shiftcode/sc-ng-commons-public/commit/118ba89a55e88defdd9e04c7a360f0db461b5ddb))
- up tp date package-lock.json ([6b6310a](https://github.com/shiftcode/sc-ng-commons-public/commit/6b6310a197ac6f697f6196108aad7f091178abf5))
- update lock file ([b003303](https://github.com/shiftcode/sc-ng-commons-public/commit/b0033036e2421399f5c526126aac335653d4437d))
- update package-lock.json ([51bdf62](https://github.com/shiftcode/sc-ng-commons-public/commit/51bdf62e67cc3fceebceb035504397a08c3725bf))
- update sc deps and lint scripts ([64c7e18](https://github.com/shiftcode/sc-ng-commons-public/commit/64c7e18e7bfd8c51489a9670ee6cbf5a059c3af8))
- update version range for rxjs ([b6a8f74](https://github.com/shiftcode/sc-ng-commons-public/commit/b6a8f748168eaeb8079e67e18641fe242692b8cb))

### Build System

- **components:** update @shiftcode/ngx-core version to ^9.0.0 || ^9.0.0-pr46 ([1f167b0](https://github.com/shiftcode/sc-ng-commons-public/commit/1f167b0fa500c3f81d1ce429d222dd29b219c358))
- **components:** update peer dependency version ([1bdcbac](https://github.com/shiftcode/sc-ng-commons-public/commit/1bdcbacbb83b270daf35026134961afc2bc6d59c))
- **core:** update version ([523eab9](https://github.com/shiftcode/sc-ng-commons-public/commit/523eab9cda067c911b0f30eaaa087259ba243885))
- **deps:** update @shiftcode/logger to version 1.1.0 ([558223d](https://github.com/shiftcode/sc-ng-commons-public/commit/558223de7a250531ce8d1c2cd0f0003f7ad1ee8d))

### Code Refactoring

- **dependencies:** add @angular/router to peer dependencies ([0251132](https://github.com/shiftcode/sc-ng-commons-public/commit/0251132a0ebf2bfbe7f14734fb43568f5b401bee))
- **flying-focus:** use inject() ([d62d011](https://github.com/shiftcode/sc-ng-commons-public/commit/d62d0118501d27bcd48503aeefe7c734f3815627))
- **logger:** do not expose internals ([8601529](https://github.com/shiftcode/sc-ng-commons-public/commit/86015291dee8f0eb528845c96c1bca28894bef79))
- **modules:** remove deprecated ng modules ([9449828](https://github.com/shiftcode/sc-ng-commons-public/commit/9449828b9bc639e9292979024e1416098a15c80b))
- **node-console-log-transport:** use colorizeForConsole from @shiftcode/utilities ([e7119f1](https://github.com/shiftcode/sc-ng-commons-public/commit/e7119f1c4777e128016716aaee9140dcf41d92aa))
- **origin:** remove no longer needed origin providers (`provideOrigin` function) ([c4145cd](https://github.com/shiftcode/sc-ng-commons-public/commit/c4145cd4560d2bdd600559cd66f7e817c78de893))
- **smooth-height:** use native animation and MutationObserver ([f366f81](https://github.com/shiftcode/sc-ng-commons-public/commit/f366f81496a7ce67d6a19d3e00caa510a32bf330))
- **ssr:** remove no longer needed `@shiftcode/ngx-ssr` lib ([2e5ce43](https://github.com/shiftcode/sc-ng-commons-public/commit/2e5ce432f944b9688dbf2c58ef47c19f0f11231e))
- **svg.component:** make url input required ([8b518aa](https://github.com/shiftcode/sc-ng-commons-public/commit/8b518aa264b125c60d1f8a969a11a1160d18128b))
- **svg:** remove constructor arguments ([c3173ae](https://github.com/shiftcode/sc-ng-commons-public/commit/c3173ae9f096729b6653e8e1955e1cef76763a1b))

### Features

- [WIP] first attempt on how to replace REQUEST ([ae8ca62](https://github.com/shiftcode/sc-ng-commons-public/commit/ae8ca6276aa8a1ae5bbc4012e2b106fc180db6dc))
- **angular:** dependencies ([57f53b9](https://github.com/shiftcode/sc-ng-commons-public/commit/57f53b91e12a5745781bcf63cdd358cc13ef1aff))
- **angular:** generating package-lock.json ([27c9785](https://github.com/shiftcode/sc-ng-commons-public/commit/27c9785b4bc263906832596d9b148087311cb237))
- **angular:** migrating to signals ([2a5ed87](https://github.com/shiftcode/sc-ng-commons-public/commit/2a5ed876f7cf13121f438ca23a0cd6f52276c024))
- **angular:** migrating to signals ([73abe3e](https://github.com/shiftcode/sc-ng-commons-public/commit/73abe3e2072d9bfa517a4dd45030f4f93d942f50))
- **angular:** refactoring ([2f2e4b3](https://github.com/shiftcode/sc-ng-commons-public/commit/2f2e4b3ad53f789e7250256ac8c615e6a824ba5d))
- **angular:** refactoring ([448d673](https://github.com/shiftcode/sc-ng-commons-public/commit/448d673c27aaace5c3ec89389e8094140462ba8c))
- **angular:** update to angular 14.0.0 ([bf3346f](https://github.com/shiftcode/sc-ng-commons-public/commit/bf3346fe8a2004666cc297dff0ab4d56e32a6418))
- **angular:** update to angular@15 ([c848401](https://github.com/shiftcode/sc-ng-commons-public/commit/c848401fc4776d87dbbfa3892062f7efefcf742a))
- **angular:** updating to angular 21 ([216cff7](https://github.com/shiftcode/sc-ng-commons-public/commit/216cff7c2ed70f2c5e5497b9729436ed12c8e3e0))
- **angular:** updating to angular 21 ([0ac6e00](https://github.com/shiftcode/sc-ng-commons-public/commit/0ac6e0075e79fe4078e387668d561cd4dc51727d))
- **angular:** updating to angular 21 ([7108822](https://github.com/shiftcode/sc-ng-commons-public/commit/710882206cae284ce1a4603b3a0031675b8fc7f1))
- **angular:** upgrading dependencies ([a5b375d](https://github.com/shiftcode/sc-ng-commons-public/commit/a5b375daa2b70ca01802acb5c7ae9d9594a2965b))
- **angular:** upgrading dependencies ([cfb0fac](https://github.com/shiftcode/sc-ng-commons-public/commit/cfb0facf51002c61dc5e8c279b670178c2c122de))
- **angular:** use angular 16 ([6d34a53](https://github.com/shiftcode/sc-ng-commons-public/commit/6d34a534d7ce2a88f2ecfee6429b226ce493d20b))
- **angular:** use angular 18 ([4610203](https://github.com/shiftcode/sc-ng-commons-public/commit/46102035f219c1c54cd5799879216cfd3e15f32e))
- **angular:** use angular 19 ([2907ec9](https://github.com/shiftcode/sc-ng-commons-public/commit/2907ec944420ce01e38b11a9e2fb6b03a8543a7f))
- **angular:** using signals ([276b948](https://github.com/shiftcode/sc-ng-commons-public/commit/276b948500feb0b7fe6e016d45ab10a51ff3aac4))
- **angular:** using signals ([8aa6817](https://github.com/shiftcode/sc-ng-commons-public/commit/8aa6817e69e143b37854095656449a108923b33e))
- **angular:** using toThrow error instead of deprecated toThrowError ([0105a03](https://github.com/shiftcode/sc-ng-commons-public/commit/0105a03a53021b0b7f1d6b93093ab66f1dc6458f))
- **auto-focus:** make directive standalone ([4ec0f7b](https://github.com/shiftcode/sc-ng-commons-public/commit/4ec0f7b752cf9f0dcf0cf55a7a86dc63d7673a1d))
- **aws/components:** update to ngx-core^7.1.0 ([f89cc4b](https://github.com/shiftcode/sc-ng-commons-public/commit/f89cc4be66f3d2441a06328334691015da996cd0))
- **aws:** update angular to version 17 ([910061f](https://github.com/shiftcode/sc-ng-commons-public/commit/910061fdfe9bfc0ab9e43725ef77a8ffc994f626))
- **aws:** update cloud watch service to write logs to APIGateway ([8db28be](https://github.com/shiftcode/sc-ng-commons-public/commit/8db28be48d469ef65d4132442bbdfed510b8fa6b))
- **button:** emit actual event in action output ([9ae67d4](https://github.com/shiftcode/sc-ng-commons-public/commit/9ae67d47e899d4af31b0a559745d11e2d150ffb8))
- **button:** make component standalone ([1596a62](https://github.com/shiftcode/sc-ng-commons-public/commit/1596a62beac6f568616e6a456f022b67c624debe))
- **click-outside:** make directive standalone ([5402c11](https://github.com/shiftcode/sc-ng-commons-public/commit/5402c11d3d155a2df3768eb55465fa0a848a0eeb))
- **client-id.service:** expose information whether clientId was created in current session ([ad94501](https://github.com/shiftcode/sc-ng-commons-public/commit/ad94501785996f96685b74cf6a85a04a220e1fc9))
- **cloud-watch.service:** prevent potential request failing with 400 ([704d699](https://github.com/shiftcode/sc-ng-commons-public/commit/704d6993a8073ed3a84b46d3cb4ae64b7f301a0f))
- **cloudwatch-log-transport-config:** allow to provide full clientConfig object ([c33ef3c](https://github.com/shiftcode/sc-ng-commons-public/commit/c33ef3c489090714e5eb2684910fefac54eaea52))
- **cloudwatch-logger:** retry creating log stream on put log event ([aa8cc2c](https://github.com/shiftcode/sc-ng-commons-public/commit/aa8cc2c8e549d521f04ef0fb7c86f6da35203590))
- **components:** update angular to version 17 ([c07933d](https://github.com/shiftcode/sc-ng-commons-public/commit/c07933ddb30658e1798a456ba77ee439c3fb6772))
- **components:** update to angular 20 ([6188a11](https://github.com/shiftcode/sc-ng-commons-public/commit/6188a1104053a9d0c5c5b4f894cc13b8c27aa2da))
- **core:** replace abstract class LogRequestInfoProvider with provider function for better DX ([7ce3626](https://github.com/shiftcode/sc-ng-commons-public/commit/7ce362631b1b6358cc7e774def042a2ebefbeb6a))
- **core:** update angular to version 17 ([1352165](https://github.com/shiftcode/sc-ng-commons-public/commit/1352165888d7488080b6c5297f3c33fdee5af819))
- **core:** update to angular 20 ([31fadb7](https://github.com/shiftcode/sc-ng-commons-public/commit/31fadb7cf557d7cce0df5e399b81df76129ffb65))
- **dependencies:** require @shiftcode/ngx-core@^12.0.0 ([5c93d4b](https://github.com/shiftcode/sc-ng-commons-public/commit/5c93d4bdfd9cada0c76f9eecbb4d4e358f163199))
- **dependencies:** use @shiftcode/ngx-core@^12.0.0 ([8a75739](https://github.com/shiftcode/sc-ng-commons-public/commit/8a75739de97439247307d4e99a7cb640d0212c10))
- **deps:** update jest@29 ([dcfc47d](https://github.com/shiftcode/sc-ng-commons-public/commit/dcfc47d5a1e5539e6b1eafef5d27b1e0c299daa5))
- **determine-origin.function:** use port from 'x-forwarded-port' header instead of always 4000 ([f31a53b](https://github.com/shiftcode/sc-ng-commons-public/commit/f31a53b82d776c4d61112c08a39b0d45aaf65f8f))
- **ensure-origin.interceptor:** introduce interceptor to prepend the origin on requests ([453b6e1](https://github.com/shiftcode/sc-ng-commons-public/commit/453b6e13be325447f8d6bb46afa9f2c4deb616a4))
- extend eslintrc files ([5bec34b](https://github.com/shiftcode/sc-ng-commons-public/commit/5bec34bbb18006127f13a763dc24a367f7fd6aad))
- **flying-focus:** make component standalone ([0499d43](https://github.com/shiftcode/sc-ng-commons-public/commit/0499d43b94bd72a30441dc4a5eea4b7ddba0385b))
- **insert-view-ref.directive:** add new directive ([c9367d2](https://github.com/shiftcode/sc-ng-commons-public/commit/c9367d2d784c8c1bc239bdc1236fb7aa332f84be))
- **insert-view-ref.directive:** add public `insert` and `detach` methods + `hasAttachedView` getter ([69b0c83](https://github.com/shiftcode/sc-ng-commons-public/commit/69b0c83daeaaf18ddade008da7f624b790df07fb))
- **is-input-element:** new helper function ([faebe03](https://github.com/shiftcode/sc-ng-commons-public/commit/faebe03eafccd9cfbc144c8d731c5050d5a4611a))
- **lint:** update eslint configs to only include necessary rules ([21af752](https://github.com/shiftcode/sc-ng-commons-public/commit/21af752ef3e939260bdcd3dbb91fe28098fd81bf))
- **local-storage:** add provide function ([9c5cc2b](https://github.com/shiftcode/sc-ng-commons-public/commit/9c5cc2b21f3cd930d6bf14dab349ea2c8678f2e7))
- **local-storage:** flag indicating whether the real LocalStorage is used ([72cfb45](https://github.com/shiftcode/sc-ng-commons-public/commit/72cfb45504fd2212574d7833ec248380a13d8e0c))
- **log-transport:** new function to provide the log transport with its config to the environment ([5abdfe6](https://github.com/shiftcode/sc-ng-commons-public/commit/5abdfe6fdf7d7383316c31d59bf135680dc07567))
- **logger:** implement base logger from @shiftcode/logger ([8561742](https://github.com/shiftcode/sc-ng-commons-public/commit/8561742b0053c5c41a324c8d479d5ea3ebcc0c34))
- **logger:** support Feature pattern to provide LogTransports ([9e97248](https://github.com/shiftcode/sc-ng-commons-public/commit/9e972485fed0fabfee6f537357a38b215c5732db))
- **navigation-class-handler:** new utility to add/remove a css class on the body while navigating ([6dd1466](https://github.com/shiftcode/sc-ng-commons-public/commit/6dd14668c9b146f4645b3ebc5b2a50d9d7dc6345))
- **navigation-class-handler:** styleguide page ([d531901](https://github.com/shiftcode/sc-ng-commons-public/commit/d5319011d9e43e1d440522605a0a5116e48dfc5f))
- **origin-http-interceptor:** add function interceptor ([f4aa7fe](https://github.com/shiftcode/sc-ng-commons-public/commit/f4aa7fe6ac24883fc5065b5d93915a785a07f3b9))
- **origin:** new environment provider function for the ORIGIN token ([b957ebe](https://github.com/shiftcode/sc-ng-commons-public/commit/b957ebe602924556a60cbcc8f903085a61dc3701))
- **origin:** new environment provider function for the ORIGIN token ([cda7e85](https://github.com/shiftcode/sc-ng-commons-public/commit/cda7e854e9d31a5d94ba1fcdd115867919c46f33))
- **provide-origin-from-env:** introduce origin provider function for ssr ([03d10c2](https://github.com/shiftcode/sc-ng-commons-public/commit/03d10c2004b48c532f6183a517e9a67054a5a35b))
- remove tslint, add .eslintrc.cjs files ([8bebbd9](https://github.com/shiftcode/sc-ng-commons-public/commit/8bebbd9aa3cd17d8a6e3d7ed8f81bce9147eb87a))
- replace tslint to eslint ([ad6c76c](https://github.com/shiftcode/sc-ng-commons-public/commit/ad6c76cc40b89ab3fd3833dc0e8679a1a2165503))
- **resolve-fn-to-can-activate-fn:** new utility to transform a ResolveFn to a CanActivateFn ([40cd715](https://github.com/shiftcode/sc-ng-commons-public/commit/40cd7153dbaecc8faf68d973980fb6c80c89a9bf))
- **root:** migrate to npm ([94a6d6d](https://github.com/shiftcode/sc-ng-commons-public/commit/94a6d6d7e75b33ceebddcde3e5f08a23858e676d))
- **root:** tslint -> eslint and yarn -> npm migrations ([e6c4786](https://github.com/shiftcode/sc-ng-commons-public/commit/e6c47865872529e169848b6f4ea5e421a76a24fb))
- run @angular/core:inject migration ([dafceb0](https://github.com/shiftcode/sc-ng-commons-public/commit/dafceb0c74a8559c7cd3c3e3d267c0b57393e383))
- **rx-let:** rx-angular inspired directive ([1edf9cc](https://github.com/shiftcode/sc-ng-commons-public/commit/1edf9cc3bab763bcdf7b46bb250d29b095584e03))
- **rxjs:** add observable factory `onDestroy` which uses the new `DestroyRef` ([f8410de](https://github.com/shiftcode/sc-ng-commons-public/commit/f8410de470088619103791b902a39d1ba3c58270))
- **sc-rx-if.directive:** new directive for if/else with observables ([6b0834f](https://github.com/shiftcode/sc-ng-commons-public/commit/6b0834f8271554a0dc600f97ee996d1ea4d14c44))
- **script-loader-service:** degrade the log level for script loading issues ([9438afa](https://github.com/shiftcode/sc-ng-commons-public/commit/9438afa1cc4ce2a60d165a1c5536511941f8108e))
- **smooth-height:** make component standalone ([d521472](https://github.com/shiftcode/sc-ng-commons-public/commit/d521472f96ff987247c9b834ab23826219f87ee8))
- **ssr:** update angular to version 17 ([d1bc79f](https://github.com/shiftcode/sc-ng-commons-public/commit/d1bc79f23a93e27393b4346f991318bab1787d1e))
- **styleguide:** remove node console transport ([bb396fb](https://github.com/shiftcode/sc-ng-commons-public/commit/bb396fb423e7b66a1da7a7b440d5729128e9a6c7))
- **svg-animate.directive:** add directive to animate svgs ([d8115fc](https://github.com/shiftcode/sc-ng-commons-public/commit/d8115fcfb5524a98a4e81ee65c77c17c2731c452))
- **svg-animate:** make directive standalone ([d7a92f3](https://github.com/shiftcode/sc-ng-commons-public/commit/d7a92f3f8063c08a586bfc824fcebcef20a8948c))
- **svg-component:** change log level in case of no internet ([b644f4c](https://github.com/shiftcode/sc-ng-commons-public/commit/b644f4c2c4df1474b07d19cc64e4a76986490345))
- **svg:** make component standalone ([337a091](https://github.com/shiftcode/sc-ng-commons-public/commit/337a091b2f4408e9d655523ff223d424d2b01d83))
- **textarea-autosize:** make directive standalone ([dba48be](https://github.com/shiftcode/sc-ng-commons-public/commit/dba48beb0c08988683b6c1231901091194480725))
- **to-promise:** static util function to ensure returned value is a promise ([5e89db0](https://github.com/shiftcode/sc-ng-commons-public/commit/5e89db0541c70f383c9ed4f3ccecd063abc2a3f7))
- **tooltip.directive:** make standalone ([de18daf](https://github.com/shiftcode/sc-ng-commons-public/commit/de18dafdbabc526a9e76646fe7d5d67aa350f3cb))
- **tooltip:** use css custom prop for padding ([bb0ea75](https://github.com/shiftcode/sc-ng-commons-public/commit/bb0ea7556c171d0e261603baf1a00850a5784c8e))
- update @angular/cdk to version 17 ([5539d46](https://github.com/shiftcode/sc-ng-commons-public/commit/5539d46dfa387c68db73278d2e4c2091ccd3bd51))
- update @angular/cli to version 17 ([3b25b39](https://github.com/shiftcode/sc-ng-commons-public/commit/3b25b399dcd3954d8a2862dc9e54ad17eeb4a3d9))
- update @shiftcode/logger to version ^3.0.0 and @shiftcode/utilities to version ^4.0.0 ([727a2cb](https://github.com/shiftcode/sc-ng-commons-public/commit/727a2cb68d00a0993dfb8a9c755d6c8283aab44f))
- update the @angular/cdk to 20 ([ac9f9ee](https://github.com/shiftcode/sc-ng-commons-public/commit/ac9f9eeebd5e16ce39cffb716ecb1e97647c4c89))
- update to angular 20 ([0ff5267](https://github.com/shiftcode/sc-ng-commons-public/commit/0ff5267a5e666153a4714bd80978a0a944f486a0))
- update to angular 21 ([b6940b5](https://github.com/shiftcode/sc-ng-commons-public/commit/b6940b5869c834ebbe463cf958c3ecbebb414cb1))
- update to angular17 (@angular/core) ([858c2e9](https://github.com/shiftcode/sc-ng-commons-public/commit/858c2e9665096fba7695bb92106eb4b66b8c73b9))
- update to latest @shiftcode/eslint-config-recommended ([2f2f686](https://github.com/shiftcode/sc-ng-commons-public/commit/2f2f6867d742beca8e365a702eb1c5c01aadf9d3))

### BREAKING CHANGES

- **smooth-height:** no more `trigger` input for `smooth-height` component. instead a MutationObserver is used
- Requires Angular ^21
- **dependencies:** require @shiftcode/ngx-core@^12.0.0
- **logger:** - the LOG_REQUEST_INFO token does no longer exist

* `provideLogRequestInfo` no longer exists. use `withRequestInfoFn` instead

- **logger:** - the LoggerFeature type and LoggerFeatureKind enum are no longer exported
- **components:** Requires Angular ^20
- **core:** Requires Angular ^20
- Requires Angular ^20
- **components:** requires @shiftcode/ngx-core ^10.0.0
- **core:** The abstract class LogRequestInfoProvider is no longer available please provide the value using
- **components:** requires @shiftcode/ngx-core version to ^9.0.0
- **core:** logGroupName was removed from CloudWatchLogTransportConfig
- requires @shiftcode/logger ^3.0.0,
  requires @shiftcode/utilities ^4.0.0
- **deps:** Implementing @shiftcode/logger leads to the consumer having to change the imports
- **angular:** requires angular@19
- **angular:** requires angular@18
- **dependencies:** requires the `@angular/router` as peer dependency
- **ssr:** for ssr use `@angular/ssr` and refactor accordingly (see `ssr.md`)
- **origin:** for ssr use `@angular/ssr` and refactor accordingly
- **ssr:** requires angular 17.1.1 as a peer dependency
- **aws:** requires angular 17.1.1 as a peer dependency
- **components:** requires angular 17.1.1 as a peer dependency
- **core:** requires angular 17.1.1 as a peer dependency
- Requires angular@^17.1.1 to be installed
- **modules:** All ng-module classes have been removed. Import standalone Components/Directives directly.
- **svg.component:** url input now required for sc-svg component
- **flying-focus:** all constructor arguments removed
- **click-outside.directive:** scClickOutside directive API change
  no longer supports [scClickOutside] boolean input for activation but `[scClickOutsideDisabled]` for disabling
- **angular:** requires angular@16
- **local-storage:** It's necessary to call `provideLocalStorage` or to provide an implementation for LocalStorage on your own
- **origin:** determinateOrigin renamed to determineOrigin
- **origin:** determineOrigin no longer expects platformId and request arguments but an optional env var name
- **svg:** SvgComponent no longer requires any constructor arguments. Only applies when extending the SvgComponent
- **angular:** now requires angular@15
- **node-console-log-transport:** now requires @shiftcode/utilities@^1.2.0

peer dependency 'ansi-styles' is no longer required

- **angular:** now requires @angular/core@^14.0.0
