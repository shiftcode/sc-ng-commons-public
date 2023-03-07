import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'
import { REMOTE_LOG_CONFIG } from './remote-log-config.injection-token'
import { RemoteLogConfig } from './remote-log-config.model'
import { RemoteLogTransport } from './remote-log-transport.service'
import { LOG_TRANSPORTS } from '../log-transports.token'

export function provideRemoteLogTransport(remoteLogConfig: RemoteLogConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: REMOTE_LOG_CONFIG, useValue: remoteLogConfig },
    { provide: LOG_TRANSPORTS, useClass: RemoteLogTransport, multi: true },
  ])
}
