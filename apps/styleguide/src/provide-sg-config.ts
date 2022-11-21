import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'
import { TOOLTIP_DEFAULT_OPTIONS, TooltipOptions } from '@shiftcode/ngx-components'
import {
  CONSOLE_LOG_TRANSPORT_CONFIG,
  ConsoleLogTransport,
  ConsoleLogTransportConfig,
  LOCAL_STORAGE_OPTIONS,
  LocalStorageOptions,
  LOG_TRANSPORTS,
  LogLevel,
} from '@shiftcode/ngx-core'

const consoleTransportConfig: ConsoleLogTransportConfig = { logLevel: LogLevel.DEBUG }
const localStorageOptions: LocalStorageOptions = { prefix: 'SG_' }

export function provideSgConfig(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // localStorage
    { provide: LOCAL_STORAGE_OPTIONS, useValue: localStorageOptions },

    // logger
    { provide: CONSOLE_LOG_TRANSPORT_CONFIG, useValue: consoleTransportConfig },
    { provide: LOG_TRANSPORTS, useClass: ConsoleLogTransport, multi: true },

    // tooltip
    { provide: TOOLTIP_DEFAULT_OPTIONS, useValue: <Partial<TooltipOptions>>{ showDelay: 0 } },
  ])
}
