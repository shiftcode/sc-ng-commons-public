import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'
import { LOG_TRANSPORTS } from '../log-transports.token'
import { ConsoleLogTransportConfig } from './console-log-transport-config'
import { CONSOLE_LOG_TRANSPORT_CONFIG } from './console-log-transport-config.injection-token'
import { NodeConsoleLogTransport } from './node-console-log-transport.service'

export function provideNodeConsoleLogTransport(
  consoleLoggerConfigOrFactory: ConsoleLogTransportConfig | (() => ConsoleLogTransportConfig),
): EnvironmentProviders {
  return makeEnvironmentProviders([
    typeof consoleLoggerConfigOrFactory === 'function'
      ? { provide: CONSOLE_LOG_TRANSPORT_CONFIG, useFactory: consoleLoggerConfigOrFactory }
      : { provide: CONSOLE_LOG_TRANSPORT_CONFIG, useValue: consoleLoggerConfigOrFactory },
    { provide: LOG_TRANSPORTS, useClass: NodeConsoleLogTransport, multi: true },
  ])
}
