# Core

Contains some general purpose services

## LocalStorage
If the browser does not support LocalStorage, we silently fall back to an in-memory storage (this is basically the case when the user prohibits access to the LS).
to check whether the LocalStorage is actually available, you can read the `LocalStorageService.persistent` property.

### Setup
To use the LocalStorage Service, you need to provide it in your `bootstrapApplication` call or your AppModule.
```ts
import { provideLocalStorage } from '@shiftcode/ngx-core'

bootstrapApplication(AppComponent, {
  providers: [
    provideLocalStorage({ prefix: 'APP.' }),
  ],
})
```

## ClientId Service
The ClientId Service is used to generate a unique id for the current user.\
It uses the LocalStorage Service to store the id.

The property `ClientIdService.createdInThisSession` exposes whether the clientId was created in this session or read from the LocalStorage.

## Logger
### Setup
To use the logger, you need to provide at least one `LogTransport`.
```ts
import { LogLevel, provideLogger, withBrowserConsoleTransport } from '@shiftcode/ngx-core'

bootstrapApplication(AppComponent, {
  providers: [
    provideLogger(
      withBrowserConsoleTransport({ logLevel: stageInfo.isProd ? LogLevel.OFF : LogLevel.DEBUG }),
    ),
  ],
})
```
### Usage
Inside your Component/Service/... inject the `LoggerService` and create a logger instance.

```ts
import { Directive, inject } from '@angular/core'
import { LoggerService } from '@shiftcode/ngx-core'
import { Logger } from '@shiftcode/logger'

@Directive({ ... })
class MyDirective {
  private readonly logger: Logger = inject(LoggerService).getInstance('MyDirective')

  doSomething() {
    this.logger.debug('doing something')
  }
}
```
### Provided LogTransports
- Browser Console: `withBrowserConsoleTransport(...)`
- Node Console: `withNodeConsoleTransport(...)`
- Remote: `withRemoteTransport(...)`
- AWS CloudWatch: see `withCloudwatchTransport(...)`

### LogRequestInfo Integration
You can enrich your log requests for `Remote` and `CloudWatch` Transports with custom information like user/session/device metadata using the `withRequestInfoFn` feature.

#### Usage Example
Use the feature `withRequestInfoFn` function to provide a factory for a `LogRequestInfoFn`.
The `LogRequestInfoFn` is a function itself that is called prior every log request. Its return value needs to be an object with the information to be included.

```ts
import { LogLevel, provideLogger, withRemoteTransport, withRequestInfoFn, LogRequestInfo } from '@shiftcode/ngx-core'

bootstrapApplication(AppComponent, {
  providers: [
    provideLogger(
      withRemoteTransport({ logLevel: LogLevel.INFO, /* ...other config... */ }),
      withRequestInfoFn(() => {
        const authService = inject(AuthService)
        const router = inject(Router)
        return (): LogRequestInfo => ({ userId: authService.currentUser?.id, url: this.router.url })
      })
    ),
  ],
})
```
