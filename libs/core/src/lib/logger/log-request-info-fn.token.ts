import { InjectionToken } from '@angular/core'

import { LogRequestInfoFn } from './log-request-info-fn.type'

export const LOG_REQUEST_INFO_FN = new InjectionToken<LogRequestInfoFn>('LOG_REQUEST_INFO_FN')
