import { LogTransport } from '@shiftcode/logger'

import { ValueOrFactory } from '../helper/value-or-factory.type'
import { LoggerFeature } from '../logger-feature.type'
import { LoggerFeatureKind } from '../logger-feature-kind.enum'
import {
  BROWSER_CONSOLE_LOG_TRANSPORT_CONFIG,
  BrowserConsoleLogTransportConfig,
  BrowserConsoleLogTransportService,
} from './browser-console-log-transport.service'

export function withBrowserConsoleTransport(config: ValueOrFactory<BrowserConsoleLogTransportConfig>): LoggerFeature {
  return {
    kind: LoggerFeatureKind.TRANSPORT,
    providers: [
      {
        provide: BROWSER_CONSOLE_LOG_TRANSPORT_CONFIG,
        ...(typeof config === 'function' ? { useFactory: config } : { useValue: config }),
      },
      { provide: LogTransport, useClass: BrowserConsoleLogTransportService, multi: true },
    ],
  }
}
