import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'
import { TOOLTIP_DEFAULT_OPTIONS, TooltipOptions } from '@shiftcode/ngx-components'
import { LOCAL_STORAGE_OPTIONS, LocalStorageOptions } from '@shiftcode/ngx-core'

const localStorageOptions: LocalStorageOptions = { prefix: 'SG_' }

export function provideSgConfig(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // localStorage
    { provide: LOCAL_STORAGE_OPTIONS, useValue: localStorageOptions },

    // tooltip
    { provide: TOOLTIP_DEFAULT_OPTIONS, useValue: <Partial<TooltipOptions>>{ showDelay: 0 } },
  ])
}
