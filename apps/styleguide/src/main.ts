import { provideHttpClient } from '@angular/common/http'
import { provideZoneChangeDetection } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import { LogLevel } from '@shiftcode/logger'
import { provideNavigationClassHandler } from '@shiftcode/ngx-components'
import { provideLocalStorage, provideLogger, withBrowserConsoleTransport } from '@shiftcode/ngx-core'

import { AppComponent } from './app/app.component'
import { provideSgConfig } from './provide-sg-config'
import { ROUTES } from './routes/routes.const'

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideHttpClient(),
    provideAnimations(),
    provideRouter(ROUTES),

    provideLocalStorage({ prefix: 'sg.' }),
    provideLogger(withBrowserConsoleTransport(() => ({ logLevel: LogLevel.DEBUG }))),
    provideNavigationClassHandler('sg-navigating'),
    provideSgConfig(),
  ],
  // eslint-disable-next-line no-console
}).catch((err) => console.error(err))
