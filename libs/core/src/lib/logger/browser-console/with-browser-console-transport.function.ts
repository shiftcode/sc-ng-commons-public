import { LogTransport } from '@shiftcode/logger'

import { LoggerFeature } from '../logger-feature.type'
import { LoggerFeatureKind } from '../logger-feature-kind.enum'
import {
  BROWSER_CONSOLE_LOG_TRANSPORT_CONFIG,
  BrowserConsoleLogTransportConfig,
  BrowserConsoleLogTransportService,
} from './browser-console-log-transport.service'

export function withBrowserConsoleTransport(
  browserConsoleLogTransportConfigOrFactory:
    | BrowserConsoleLogTransportConfig
    | (() => BrowserConsoleLogTransportConfig),
): LoggerFeature {
  const configProvider =
    typeof browserConsoleLogTransportConfigOrFactory === 'function'
      ? { provide: BROWSER_CONSOLE_LOG_TRANSPORT_CONFIG, useFactory: browserConsoleLogTransportConfigOrFactory }
      : { provide: BROWSER_CONSOLE_LOG_TRANSPORT_CONFIG, useValue: browserConsoleLogTransportConfigOrFactory }

  return {
    kind: LoggerFeatureKind.TRANSPORT,
    providers: [
      configProvider,
      { provide: LogTransport, useClass: BrowserConsoleLogTransportService, multi: true }
    ],
  }
}
