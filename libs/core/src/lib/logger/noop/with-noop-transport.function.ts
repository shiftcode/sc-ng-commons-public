import { LOG_TRANSPORTS } from '../log-transports.token'
import { LoggerFeature, LoggerFeatureKind } from '../provide-logger'
import { NoopLogTransport } from './noop-log-transport.service'

export function withNoopTransport(): LoggerFeature {
  return {
    kind: LoggerFeatureKind.TRANSPORT,
    providers: [{ provide: LOG_TRANSPORTS, useClass: NoopLogTransport, multi: true }],
  }
}
