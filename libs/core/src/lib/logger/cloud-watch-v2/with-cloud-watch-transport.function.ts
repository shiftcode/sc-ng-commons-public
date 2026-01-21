import { LogTransport } from '@shiftcode/logger'

import { ValueOrFactory } from '../helper/value-or-factory.type'
import { LoggerFeature } from '../logger-feature.type'
import { LoggerFeatureKind } from '../logger-feature-kind.enum'
import { CloudWatchLogTransportServiceV2 } from './cloud-watch-log-transport.service'
import {
  CLOUD_WATCH_LOG_TRANSPORT_CONFIG_V2,
  CloudWatchLogTransportConfigV2,
} from './cloud-watch-log-transport-config.injection-token'

export function withCloudWatchTransportV2(config: ValueOrFactory<CloudWatchLogTransportConfigV2>): LoggerFeature {
  return {
    kind: LoggerFeatureKind.TRANSPORT,
    providers: [
      {
        provide: CLOUD_WATCH_LOG_TRANSPORT_CONFIG_V2,
        ...(typeof config === 'function' ? { useFactory: config } : { useValue: config }),
      },
      { provide: LogTransport, useClass: CloudWatchLogTransportServiceV2, multi: true },
    ],
  }
}
