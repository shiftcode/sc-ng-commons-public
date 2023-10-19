# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.0.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-ssr@3.0.0...@shiftcode/ngx-ssr@4.0.0) (2023-10-19)

### Bug Fixes

- **determine-origin:** ensure no trailing slash in origin ([f8f3171](https://github.com/shiftcode/sc-ng-commons-public/commit/f8f31715a5425a4fc7302c4dfef58e1ea7ef0bcb))

### Features

- **angular:** use angular 16 ([6d34a53](https://github.com/shiftcode/sc-ng-commons-public/commit/6d34a534d7ce2a88f2ecfee6429b226ce493d20b))
- **origin-http-interceptor:** add function interceptor ([f4aa7fe](https://github.com/shiftcode/sc-ng-commons-public/commit/f4aa7fe6ac24883fc5065b5d93915a785a07f3b9))

### BREAKING CHANGES

- **angular:** requires angular@16

# [3.0.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-ssr@2.0.0...@shiftcode/ngx-ssr@3.0.0) (2023-05-02)

### Features

- **angular:** update to angular@15 ([c848401](https://github.com/shiftcode/sc-ng-commons-public/commit/c848401fc4776d87dbbfa3892062f7efefcf742a))
- **determine-origin.function:** use port from 'x-forwarded-port' header instead of always 4000 ([f31a53b](https://github.com/shiftcode/sc-ng-commons-public/commit/f31a53b82d776c4d61112c08a39b0d45aaf65f8f))
- **origin:** new environment provider function for the ORIGIN token ([cda7e85](https://github.com/shiftcode/sc-ng-commons-public/commit/cda7e854e9d31a5d94ba1fcdd115867919c46f33))

### BREAKING CHANGES

- **origin:** determineOrigin no longer expects platformId and request arguments but an optional env var name
- **angular:** now requires angular@15

# [2.0.0](https://github.com/shiftcode/sc-ng-commons-public/compare/@shiftcode/ngx-ssr@1.0.0...@shiftcode/ngx-ssr@2.0.0) (2022-10-17)

### Features

- **angular:** update to angular 14.0.0 ([bf3346f](https://github.com/shiftcode/sc-ng-commons-public/commit/bf3346fe8a2004666cc297dff0ab4d56e32a6418))

### BREAKING CHANGES

- **angular:** now requires @angular/core@^14.0.0

# 1.0.0 (2022-01-22)

**Note:** Version bump only for package @shiftcode/ngx-ssr
