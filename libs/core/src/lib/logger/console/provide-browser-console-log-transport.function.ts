import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'
import { LOG_TRANSPORTS } from '../log-transports.token'
import { ConsoleLogTransportConfig } from './console-log-transport-config'
import { CONSOLE_LOG_TRANSPORT_CONFIG } from './console-log-transport-config.injection-token'
import { ConsoleLogTransport } from './console-log-transport.service'

export function provideBrowserConsoleLogTransport(
  consoleLoggerConfig: ConsoleLogTransportConfig,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: CONSOLE_LOG_TRANSPORT_CONFIG, useValue: consoleLoggerConfig },
    { provide: LOG_TRANSPORTS, useClass: ConsoleLogTransport, multi: true },
  ])
}
