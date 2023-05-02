import { LOG_TRANSPORTS, LoggerFeature, LoggerFeatureKind } from '@shiftcode/ngx-core'
import { CLOUD_WATCH_LOG_TRANSPORT_CONFIG } from './cloud-watch-log-transport-config.injection-token'
import { CloudWatchLogTransportConfig } from './cloud-watch-log-transport-config.model'
import { CloudWatchLogTransport } from './cloud-watch-log-transport.service'

export function withCloudwatchTransport(
  cloudWatchLogTransportConfigOrFactory: CloudWatchLogTransportConfig | (() => CloudWatchLogTransportConfig),
): LoggerFeature {
  const configProvider =
    typeof cloudWatchLogTransportConfigOrFactory === 'function'
      ? { provide: CLOUD_WATCH_LOG_TRANSPORT_CONFIG, useFactory: cloudWatchLogTransportConfigOrFactory }
      : { provide: CLOUD_WATCH_LOG_TRANSPORT_CONFIG, useValue: cloudWatchLogTransportConfigOrFactory }

  return {
    kind: LoggerFeatureKind.TRANSPORT,
    providers: [configProvider, { provide: LOG_TRANSPORTS, useClass: CloudWatchLogTransport, multi: true }],
  }
}
