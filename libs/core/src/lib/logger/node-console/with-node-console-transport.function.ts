import { LogTransport } from '@shiftcode/logger'

import { ValueOrFactory } from '../helper/value-or-factory.type'
import { LoggerFeature } from '../logger-feature.type'
import { LoggerFeatureKind } from '../logger-feature-kind.enum'
import { NODE_CONSOLE_LOG_TRANSPORT_CONFIG, NodeConsoleLogTransportService } from './node-console-log-transport.service'

export function withNodeConsoleTransport(config: ValueOrFactory<any>): LoggerFeature {
  return {
    kind: LoggerFeatureKind.TRANSPORT,
    providers: [
      {
        provide: NODE_CONSOLE_LOG_TRANSPORT_CONFIG,
        ...(typeof config === 'function' ? { useFactory: config } : { useValue: config }),
      },
      { provide: LogTransport, useClass: NodeConsoleLogTransportService, multi: true },
    ],
  }
}
