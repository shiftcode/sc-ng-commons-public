import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'
import { TOOLTIP_DEFAULT_OPTIONS, TooltipOptions } from '@shiftcode/ngx-components'

export function provideSgConfig(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // tooltip
    { provide: TOOLTIP_DEFAULT_OPTIONS, useValue: <Partial<TooltipOptions>>{ showDelay: 0 } },
  ])
}
