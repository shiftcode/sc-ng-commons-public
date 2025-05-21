import { LoggerFeature, LoggerFeatureKind } from '../provide-logger'
import { ConsoleLogTransportConfig } from './console-log-transport-config'
import { CONSOLE_LOG_TRANSPORT_CONFIG } from './console-log-transport-config.injection-token'
import { NodeConsoleLogTransport } from './node-console-log-transport.service'
import { LogTransport } from '@shiftcode/logger'

export function withNodeConsoleTransport(
  consoleLoggerConfigOrFactory: ConsoleLogTransportConfig | (() => ConsoleLogTransportConfig),
): LoggerFeature {
  const configProvider =
    typeof consoleLoggerConfigOrFactory === 'function'
      ? { provide: CONSOLE_LOG_TRANSPORT_CONFIG, useFactory: consoleLoggerConfigOrFactory }
      : { provide: CONSOLE_LOG_TRANSPORT_CONFIG, useValue: consoleLoggerConfigOrFactory }

  return {
    kind: LoggerFeatureKind.TRANSPORT,
    providers: [configProvider, { provide: LogTransport, useClass: NodeConsoleLogTransport, multi: true }],
  }
}
