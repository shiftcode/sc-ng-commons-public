# @shiftcode/ngx-ssr
Services and helpers used for server side rendering.

### SsrHttpInterceptor & ORIGIN Token
Rewrites relative urls on ssr to `${ORIGIN}/${relativeUrl}`\
where Origin is the injected value from the `ORIGIN` token.
  - when in Lambda: using the value from the provided ENV VAR (tris to read the `FINAL_DOMAIN` env var if no other name provided).
  - when local: `${request.protocol}://${request.hostname}:${port}/${relativeUrl}`
    - where port is the `x-forwarded-port` header value or the fallback value `4000`

## Usage

- Make sure the configured environment Variable for the origin is set in your Lambda function.
```ts
import { ServerModule } from '@angular/platform-server'
import { provideOrigin, SsrHttpInterceptor } from '@shiftcode/ngx-ssr'
import { AppComponent } from './app.component'
import { AppModule } from './app.module'

@NgModule({
  imports: [ServerModule, AppModule],
  providers: [
    provideOrigin({ envVarName: 'FINAL_DOMAIN' }),
    { provide: HTTP_INTERCEPTORS, useClass: SsrHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
```

## depends on
- `@angular/core` + `@angular/commons`
- `@nguniversal/express-engine`
- `express`
- `@shiftcode/ngx-core` (`Logger`)
