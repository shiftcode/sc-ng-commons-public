
import { LogTransport } from '@shiftcode/logger'

import { ValueOrFactory } from '../helper/value-or-factory.type'
import { LoggerFeature } from '../logger-feature.type'
import { LoggerFeatureKind } from '../logger-feature-kind.enum'
import {
  NODE_CONSOLE_LOG_TRANSPORT_CONFIG,
  NodeConsoleLogTransportService,
} from './node-console-log-transport.service'

export function withNodeConsoleTransport(
  nodeConsoleLogTransportConfig: ValueOrFactory<any>,
): LoggerFeature {
  return {
    kind: LoggerFeatureKind.TRANSPORT,
    providers: [
      {
        provide: NODE_CONSOLE_LOG_TRANSPORT_CONFIG,
        ...(typeof nodeConsoleLogTransportConfig === 'function'
          ? { useFactory: nodeConsoleLogTransportConfig }
          : { useValue: nodeConsoleLogTransportConfig }),
      },
      { provide: LogTransport, useClass: NodeConsoleLogTransportService, multi: true },
    ],
  }
}
