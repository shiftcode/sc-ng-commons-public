import { inject, Injectable } from '@angular/core'
import { LogLevel, LogTransport } from '@shiftcode/logger'

import { CloudWatchServiceV2 } from './cloud-watch.service'
import { CLOUD_WATCH_LOG_TRANSPORT_CONFIG_V2 } from './cloud-watch-log-transport-config.injection-token'

/**
 * The LogTransport implementation using {@link CloudWatchServiceV2}.
 * Delegates all logging logic to the CloudWatchLogger.
 * Requires the {@link CLOUD_WATCH_LOG_TRANSPORT_CONFIG_V2} to be provided.
 */
@Injectable({ providedIn: 'root' })
export class CloudWatchLogTransportServiceV2 extends LogTransport {
  private readonly cloudWatchLogger = inject(CloudWatchServiceV2)

  constructor() {
    super(inject(CLOUD_WATCH_LOG_TRANSPORT_CONFIG_V2).logLevel)
  }

  log(level: LogLevel, clazzName: string, _color: string, timestamp: Date, args: unknown[]): void {
    // checking the log level is done in the cloudWatchLogger. important.
    this.cloudWatchLogger.addMessage(level, clazzName, timestamp, args)
  }
}
