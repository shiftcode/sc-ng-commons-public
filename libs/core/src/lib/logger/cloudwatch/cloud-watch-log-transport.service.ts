import { Inject, Injectable } from '@angular/core'
import { LogLevel, LogTransport } from '@shiftcode/logger'
import { CLOUD_WATCH_LOG_TRANSPORT_CONFIG } from './cloud-watch-log-transport-config.injection-token'
import { CloudWatchLogTransportConfig } from './cloud-watch-log-transport-config.model'
import { CloudWatchService } from './cloud-watch.service'

/**
 * The LogTransport implementation using {@link CloudWatchService}
 * requires the {@link CLOUD_WATCH_LOG_TRANSPORT_CONFIG} to be provided.
 */
@Injectable({ providedIn: 'root' })
export class CloudWatchLogTransport extends LogTransport {
  constructor(
    @Inject(CLOUD_WATCH_LOG_TRANSPORT_CONFIG) logTransportConfig: CloudWatchLogTransportConfig,
    private cloudWatchService: CloudWatchService,
  ) {
    super(logTransportConfig.logLevel)
  }

  log(level: LogLevel, clazzName: string, color: string, timestamp: Date, args: any[]) {
    // send to cloudwatch if level enabled
    if (this.isLevelEnabled(level)) {
      this.cloudWatchService.addMessage(level, clazzName, timestamp, args)
    }
  }
}
