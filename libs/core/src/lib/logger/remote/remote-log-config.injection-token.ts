import { InjectionToken } from '@angular/core'

import { RemoteLogConfig } from './remote-log-config.model'

export const REMOTE_LOG_CONFIG = new InjectionToken<RemoteLogConfig>('remoteLogConfig')
