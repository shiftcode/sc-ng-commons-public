import { LogTransport } from '@shiftcode/logger'

import { LoggerFeature } from '../logger-feature.type'
import { LoggerFeatureKind } from '../logger-feature-kind.enum'
import { CloudWatchLogTransport } from './cloud-watch-log-transport.service'
import { CLOUD_WATCH_LOG_TRANSPORT_CONFIG } from './cloud-watch-log-transport-config.injection-token'
import { CloudWatchLogTransportConfig } from './cloud-watch-log-transport-config.model'

export function withCloudwatchTransport(
  cloudWatchLogTransportConfigOrFactory: CloudWatchLogTransportConfig | (() => CloudWatchLogTransportConfig),
): LoggerFeature {
  const configProvider =
    typeof cloudWatchLogTransportConfigOrFactory === 'function'
      ? { provide: CLOUD_WATCH_LOG_TRANSPORT_CONFIG, useFactory: cloudWatchLogTransportConfigOrFactory }
      : { provide: CLOUD_WATCH_LOG_TRANSPORT_CONFIG, useValue: cloudWatchLogTransportConfigOrFactory }

  return {
    kind: LoggerFeatureKind.TRANSPORT,
    providers: [configProvider, { provide: LogTransport, useClass: CloudWatchLogTransport, multi: true }],
  }
}
