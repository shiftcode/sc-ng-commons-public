import { inject, Injectable } from '@angular/core'
import { LogLevel, LogTransport } from '@shiftcode/logger'

import { RemoteLogService } from './remote-log.service'
import { REMOTE_LOG_CONFIG } from './remote-log-config.injection-token'

@Injectable({ providedIn: 'root' })
export class RemoteLogTransport extends LogTransport {
  private readonly remoteLogService = inject(RemoteLogService)

  constructor() {
    super(inject(REMOTE_LOG_CONFIG).logLevel)
  }

  log(level: LogLevel, clazzName: string, color: string, timestamp: Date, args: any[]) {
    if (this.isLevelEnabled(level)) {
      this.remoteLogService.sendMessage(level, clazzName, timestamp, args)
    }
  }
}
