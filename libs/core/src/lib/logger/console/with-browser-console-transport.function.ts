import { ConsoleLogTransportConfig } from './console-log-transport-config'
import { CONSOLE_LOG_TRANSPORT_CONFIG } from './console-log-transport-config.injection-token'
import { ConsoleLogTransport } from './console-log-transport.service'
import { LogTransport } from '@shiftcode/logger'
import { LoggerFeatureKind } from '../logger-feature-kind.enum'
import { LoggerFeature } from '../logger-feature.type'

export function withBrowserConsoleTransport(
  consoleLoggerConfigOrFactory: ConsoleLogTransportConfig | (() => ConsoleLogTransportConfig),
): LoggerFeature {
  const configProvider =
    typeof consoleLoggerConfigOrFactory === 'function'
      ? { provide: CONSOLE_LOG_TRANSPORT_CONFIG, useFactory: consoleLoggerConfigOrFactory }
      : { provide: CONSOLE_LOG_TRANSPORT_CONFIG, useValue: consoleLoggerConfigOrFactory }

  return {
    kind: LoggerFeatureKind.TRANSPORT,
    providers: [configProvider, { provide: LogTransport, useClass: ConsoleLogTransport, multi: true }],
  }
}
