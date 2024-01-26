import { InjectionToken } from '@angular/core'
import type { Request } from 'express'

export const REQUEST = new InjectionToken<Request>('REQUEST')
