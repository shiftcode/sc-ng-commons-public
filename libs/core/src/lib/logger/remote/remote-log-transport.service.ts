import { Inject, Injectable } from '@angular/core'
import { LogLevel } from '../log-level.enum'
import { LogTransport } from '../log-transport'
import { REMOTE_LOG_CONFIG } from './remote-log-config.injection-token'
import { RemoteLogConfig } from './remote-log-config.model'
import { RemoteLogService } from './remote-log.service'

@Injectable({ providedIn: 'root' })
export class RemoteLogTransport extends LogTransport {
  constructor(@Inject(REMOTE_LOG_CONFIG) config: RemoteLogConfig, private remoteLogService: RemoteLogService) {
    super()
    this.logLevel = config.logLevel
  }

  log(level: LogLevel, clazzName: string, color: string, timestamp: Date, args: any[]) {
    if (this.isLevelEnabled(level)) {
      this.remoteLogService.sendMessage(level, clazzName, timestamp, args)
    }
  }
}
