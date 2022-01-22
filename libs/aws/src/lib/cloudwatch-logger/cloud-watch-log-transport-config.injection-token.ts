import { InjectionToken } from '@angular/core'
import { CloudWatchLogTransportConfig } from './cloud-watch-log-transport-config.model'

export const CLOUD_WATCH_LOG_TRANSPORT_CONFIG = new InjectionToken<CloudWatchLogTransportConfig>(
  'cloudWatchLogTransportConfig',
)
