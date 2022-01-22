# @shiftcode/ngx-aws
Angular Services working with AWS

## Cloudwatch Logger
Send Logs to AWS CloudWatch Logs

Use the `CloudWatchErrorHandler` to send uncaught errors to CloudWatch Logs

### Example Usage
```typescript
import { ErrorHandler, NgModule } from '@angular/core'
import { LOG_TRANSPORTS, LogLevel } from '@shiftcode/ngx-core'
import {
  CLOUD_WATCH_LOG_TRANSPORT_CONFIG,
  CloudWatchErrorHandler,
  CloudWatchLogTransport,
  CloudWatchLogTransportConfig,
} from '@shiftcode/ngx-aws'

const cloudWatchLogConfig: CloudWatchLogTransportConfig = {
  awsRegion: 'eu-central-1',
  logLevel: LogLevel.WARN,
  logGroupName: 'client-log-group-name',
  flushInterval: 3000,
  awsCredentials$: of({/* get your credentials */}),
}

@NgModule({
  providers: [
    { provide: CLOUD_WATCH_LOG_TRANSPORT_CONFIG, useValue: cloudWatchLogConfig },
    { provide: LOG_TRANSPORTS, useClass: CloudWatchLogTransport, multi: true },
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
