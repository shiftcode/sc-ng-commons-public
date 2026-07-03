import { InjectionToken } from '@angular/core'

import { TestingFabWidget } from './testing-fab-widget.type'

export const TESTING_FAB_WIDGETS = new InjectionToken<readonly TestingFabWidget[]>('')
