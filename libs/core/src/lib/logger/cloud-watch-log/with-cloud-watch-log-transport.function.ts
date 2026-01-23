import { LogTransport } from '@shiftcode/logger'

import { ValueOrFactory } from '../helper/value-or-factory.type'
import { LoggerFeature } from '../logger-feature.type'
import { LoggerFeatureKind } from '../logger-feature-kind.enum'
import { CLOUD_WATCH_LOG_V2_CONFIG, CloudWatchLogV2Config } from './cloud-watch-log-config.injection-token'
import { CloudWatchLogV2TransportService } from './cloud-watch-log-transport.service'

export function withCloudWatchLogV2Transport(config: ValueOrFactory<CloudWatchLogV2Config>): LoggerFeature {
  return {
    kind: LoggerFeatureKind.TRANSPORT,
    providers: [
      {
        provide: CLOUD_WATCH_LOG_V2_CONFIG,
        ...(typeof config === 'function' ? { useFactory: config } : { useValue: config }),
      },
      { provide: LogTransport, useClass: CloudWatchLogV2TransportService, multi: true },
    ],
  }
}
