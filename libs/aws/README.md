# @shiftcode/ngx-aws
Angular Services working with AWS

## Cloudwatch Logger

### Example Usage
```typescript
import { LOG_TRANSPORTS, LogLevel } from '@shiftcode/ng-core'
import { CLOUD_WATCH_LOG_TRANSPORT_CONFIG, CloudWatchLogTransport, CloudWatchLogTransportConfig } from '@shiftcode/ng-aws'

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
