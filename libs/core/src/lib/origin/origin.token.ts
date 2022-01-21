import { InjectionToken } from '@angular/core'

export const ORIGIN = new InjectionToken<string>('Origin', {
  factory: () => {
    throw new Error(
      'No `ORIGIN` provider. You need to provide the OriginModule in AppModule. If using SSR provide the OriginModule from @shiftcode/ngx-ssr in AppServerModule.',
    )
  },
})
