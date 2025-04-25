import { provideHttpClient } from '@angular/common/http'
import { bootstrapApplication } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import { provideNavigationClassHandler } from '@shiftcode/ngx-components'
import { provideLocalStorage, provideLogger, withBrowserConsoleTransport } from '@shiftcode/ngx-core'
import { LogLevel } from '@shiftcode/logger'
import { AppComponent } from './app/app.component'
import { provideSgConfig } from './provide-sg-config'
import { ROUTES } from './routes/routes.const'

bootstrapApplication(AppComponent, {
  providers: [
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
