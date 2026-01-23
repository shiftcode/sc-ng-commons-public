import { inject, Injectable } from '@angular/core'
import { LogLevel, LogTransport } from '@shiftcode/logger'

import { CloudWatchLogV2Service } from './cloud-watch-log.service'
import { CLOUD_WATCH_LOG_V2_CONFIG } from './cloud-watch-log-config.injection-token'

/**
 * The LogTransport implementation using {@link CloudWatchLogV2Service}.
 * Delegates all logging logic to the CloudWatchLogger.
 * Requires the {@link CLOUD_WATCH_LOG_V2_CONFIG} to be provided.
 */
@Injectable({ providedIn: 'root' })
export class CloudWatchLogV2TransportService extends LogTransport {
  private readonly cloudWatchLogger = inject(CloudWatchLogV2Service)

  constructor() {
    super(inject(CLOUD_WATCH_LOG_V2_CONFIG).logLevel)
  }

  log(level: LogLevel, clazzName: string, _color: string, timestamp: Date, args: unknown[]): void {
    // checking the log level is done in the cloudWatchLogger. important.
    this.cloudWatchLogger.addMessage(level, clazzName, timestamp, args)
  }
}
