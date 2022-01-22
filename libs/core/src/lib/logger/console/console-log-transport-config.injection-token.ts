import { InjectionToken } from '@angular/core'
import { ConsoleLogTransportConfig } from './console-log-transport-config'

export const CONSOLE_LOG_TRANSPORT_CONFIG = new InjectionToken<ConsoleLogTransportConfig>('consoleLogTransportConfig')
