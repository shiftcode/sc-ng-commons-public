import { InjectionToken } from '@angular/core'

import { TooltipOptions } from './tooltip-options.model'

export const TOOLTIP_DEFAULT_OPTIONS = new InjectionToken<Partial<TooltipOptions>>('TOOLTIP_DEFAULT_OPTIONS')
