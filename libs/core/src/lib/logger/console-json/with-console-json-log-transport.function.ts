import { LogTransport } from '@shiftcode/logger'

import { ValueOrFactory } from '../helper/value-or-factory.type'
import { LoggerFeature } from '../logger-feature.type'
import { LoggerFeatureKind } from '../logger-feature-kind.enum'
import {
  CONSOLE_JSON_LOG_TRANSPORT_CONFIG,
  ConsoleJsonLogTransportConfig,
  ConsoleJsonLogTransportService,
} from './console-json-log-transport.service'

export function withConsoleJsonLogTransport(config: ValueOrFactory<ConsoleJsonLogTransportConfig>): LoggerFeature {
  return {
    kind: LoggerFeatureKind.TRANSPORT,
    providers: [
      {
        provide: CONSOLE_JSON_LOG_TRANSPORT_CONFIG,
        ...(typeof config === 'function' ? { useFactory: config } : { useValue: config }),
      },
      { provide: LogTransport, useClass: ConsoleJsonLogTransportService, multi: true },
    ],
  }
}
