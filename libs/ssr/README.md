# @shiftcode/ngx-ssr
Services and helpers used for server side rendering.

- OriginModule
  - depends on env var `FINAL_DOMAIN`
- SsrHttpInterceptor to rewrite urls on ssr
  - rewrites urls for local usage on port 4000

## depends on
- `@angular/core` + `@angular/commons`
- `@nguniversal/express-engine`
- `express`
- `@shiftcode/ngx-core` (`Logger`)
