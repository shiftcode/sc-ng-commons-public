import { LOG_TRANSPORTS, LoggerFeature, LoggerFeatureKind } from '@shiftcode/ngx-core'
import { CLOUD_WATCH_LOG_TRANSPORT_CONFIG } from './cloud-watch-log-transport-config.injection-token'
import { CloudWatchLogTransportConfig } from './cloud-watch-log-transport-config.model'
import { CloudWatchLogTransport } from './cloud-watch-log-transport.service'
import { Provider } from '@angular/core'

function isCloudWatchTransportConfig(v: CloudWatchLogTransportConfig | Provider): v is CloudWatchLogTransportConfig {
  return (<Array<keyof CloudWatchLogTransportConfig>>[
    'logLevel',
    'logGroupName',
    'clientConfig$',
    'flushInterval',
  ]).every((propertyName) => propertyName in v)
}

export function withCloudwatchTransport(
  cloudWatchLogTransportConfigOrProvider: CloudWatchLogTransportConfig | Provider,
): LoggerFeature {
  const configProvider: Provider = isCloudWatchTransportConfig(cloudWatchLogTransportConfigOrProvider)
    ? { provide: CLOUD_WATCH_LOG_TRANSPORT_CONFIG, useValue: cloudWatchLogTransportConfigOrProvider }
    : cloudWatchLogTransportConfigOrProvider

  return {
    kind: LoggerFeatureKind.TRANSPORT,
    providers: [configProvider, { provide: LOG_TRANSPORTS, useClass: CloudWatchLogTransport, multi: true }],
  }
}
