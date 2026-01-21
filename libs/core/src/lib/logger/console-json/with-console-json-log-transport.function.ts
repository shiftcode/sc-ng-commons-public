import { LogTransport } from '@shiftcode/logger'

import { ValueOrFactory } from '../helper/value-or-factory.type'
import { LoggerFeature } from '../logger-feature.type'
import { LoggerFeatureKind } from '../logger-feature-kind.enum'
import {
  CONSOLE_JSON_LOG_TRANSPORT_CONFIG,
  ConsoleJsonLogTransportConfig,
  ConsoleJsonLogTransportService,
} from './console-json-log-transport.service'

export function withConsoleJsonLogTransport(
  consoleJsonLogTransportConfig: ValueOrFactory<ConsoleJsonLogTransportConfig>,
): LoggerFeature {
  return {
    kind: LoggerFeatureKind.TRANSPORT,
    providers: [
      {
        provide: CONSOLE_JSON_LOG_TRANSPORT_CONFIG,
        ...(typeof consoleJsonLogTransportConfig === 'function'
          ? { useFactory: consoleJsonLogTransportConfig }
          : { useValue: consoleJsonLogTransportConfig }),
      },
      { provide: LogTransport, useClass: ConsoleJsonLogTransportService, multi: true },
    ],
  }
}
