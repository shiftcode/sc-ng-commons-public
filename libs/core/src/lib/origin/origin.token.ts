import { InjectionToken } from '@angular/core'

export const ORIGIN = new InjectionToken<string>('Origin', {
  factory: () => {
    throw new Error('No `ORIGIN` provider. Use provideOrigin()')
  },
})
