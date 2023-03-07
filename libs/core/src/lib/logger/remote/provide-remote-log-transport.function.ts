import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'
import { REMOTE_LOG_CONFIG } from './remote-log-config.injection-token'
import { RemoteLogConfig } from './remote-log-config.model'
import { RemoteLogTransport } from './remote-log-transport.service'
import { LOG_TRANSPORTS } from '../log-transports.token'

export function provideRemoteLogTransport(
  remoteLogConfigOrFactory: RemoteLogConfig | (() => RemoteLogConfig),
): EnvironmentProviders {
  return makeEnvironmentProviders([
    typeof remoteLogConfigOrFactory === 'function'
      ? { provide: REMOTE_LOG_CONFIG, useFactory: remoteLogConfigOrFactory }
      : { provide: REMOTE_LOG_CONFIG, useValue: remoteLogConfigOrFactory },
    { provide: LOG_TRANSPORTS, useClass: RemoteLogTransport, multi: true },
  ])
}
