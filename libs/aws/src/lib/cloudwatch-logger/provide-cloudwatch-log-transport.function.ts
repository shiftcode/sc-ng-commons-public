import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'
import { LOG_TRANSPORTS } from '@shiftcode/ngx-core'
import { CloudWatchLogTransportConfig } from './cloud-watch-log-transport-config.model'
import { CloudWatchLogTransport } from './cloud-watch-log-transport.service'
import { CLOUD_WATCH_LOG_TRANSPORT_CONFIG } from './cloud-watch-log-transport-config.injection-token'

export function provideCloudwatchLogTransport(
  cloudWatchLogTransportConfigOrFactory: CloudWatchLogTransportConfig | (() => CloudWatchLogTransportConfig),
): EnvironmentProviders {
  return makeEnvironmentProviders([
    typeof cloudWatchLogTransportConfigOrFactory === 'function'
      ? { provide: CLOUD_WATCH_LOG_TRANSPORT_CONFIG, useFactory: cloudWatchLogTransportConfigOrFactory }
      : { provide: CLOUD_WATCH_LOG_TRANSPORT_CONFIG, useValue: cloudWatchLogTransportConfigOrFactory },
    { provide: LOG_TRANSPORTS, useClass: CloudWatchLogTransport, multi: true },
  ])
}
