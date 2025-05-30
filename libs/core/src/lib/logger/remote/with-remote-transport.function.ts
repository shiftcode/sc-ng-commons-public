import { LoggerFeature, LoggerFeatureKind } from '../provide-logger'
import { REMOTE_LOG_CONFIG } from './remote-log-config.injection-token'
import { RemoteLogConfig } from './remote-log-config.model'
import { RemoteLogTransport } from './remote-log-transport.service'
import { LogTransport } from '@shiftcode/logger'

export function withRemoteTransport(
  remoteLogConfigOrFactory: RemoteLogConfig | (() => RemoteLogConfig),
): LoggerFeature {
  const configProvider =
    typeof remoteLogConfigOrFactory === 'function'
      ? { provide: REMOTE_LOG_CONFIG, useFactory: remoteLogConfigOrFactory }
      : { provide: REMOTE_LOG_CONFIG, useValue: remoteLogConfigOrFactory }

  return {
    kind: LoggerFeatureKind.TRANSPORT,
    providers: [configProvider, { provide: LogTransport, useClass: RemoteLogTransport, multi: true }],
  }
}
