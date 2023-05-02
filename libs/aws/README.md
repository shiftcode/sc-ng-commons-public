# @shiftcode/ngx-aws
Angular Services working with AWS

## Cloudwatch Logger
Send Logs to AWS CloudWatch Logs

Use the `withCloudwatchTransport(...)` feature for the `Logger` to send log statements to CloudWatch Logs.\
Optionally the `CloudWatchErrorHandler` can be provided to send uncaught errors to CloudWatch Logs.

### Example Usage
```ts
import { ErrorHandler, NgModule } from '@angular/core'
import { provideLogger, LogLevel } from '@shiftcode/ngx-core'
import { CloudWatchErrorHandler, CloudWatchLogTransportConfig } from '@shiftcode/ngx-aws'

function cloudWatchLogConfigFactory(): CloudWatchLogTransportConfig {
  const appConfig = inject(APP_CONFIG)
  return  {
    logLevel: LogLevel.WARN,
    logGroupName: 'client-log-group-name',
    flushInterval: 3000,
    clientConfig$: of({
      region: 'eu-central-1',
      credentials: {
        accessKeyId: appConfig.iamAccessKeyId,
        secretAccessKey: appConfig.iamSecretAccessKey,
      },
    }),
  }
}

@NgModule({
  providers: [
    provideLogger(
      withCloudwatchTransport(cloudWatchLogConfigFactory), // instead of a factory the value itself could be provided
    ),
    { provide: ErrorHandler, useClass: CloudWatchErrorHandler },
  ],
})
export class AppModule {}

```



## depends on
- `@angular/core` + `@angular/common`
- `rxjs`
- `@aws-sdk/client-cloudwatch-logs` + `@aws-sdk/types`
- `@shiftcode/ngx-core`
- `@shiftcode/utilities`
