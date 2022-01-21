import { InjectionToken } from '@angular/core'
import { LogTransport } from './log-transport'

export const LOG_TRANSPORTS = new InjectionToken<LogTransport | LogTransport[]>('LOG_TRANSPORTS')
