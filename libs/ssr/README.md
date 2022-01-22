# @shiftcode/ngx-ssr
Services and helpers used for server side rendering.

- `SsrHttpInterceptor` to rewrite relative urls on ssr
  - when in Lambda: rewrites to `${env.FINAL_DOMAIN}/${relativeUrl}`
  - when local: rewrites to `${request.protocol}://${request.hostname}:4000/${relativeUrl}`

## Usage

- Make sure the environment Variable `FINAL_DOMAIN` is set
```typescript
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server'
import { ORIGIN_PROVIDER, SsrHttpInterceptor } from '@shiftcode/ngx-ssr'
import { AppComponent } from './app.component'
import { AppModule } from './app.module'

@NgModule({
  imports: [ServerModule, ServerTransferStateModule, AppModule],
  providers: [
    ORIGIN_PROVIDER,
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
