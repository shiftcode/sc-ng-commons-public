import { provideHttpClient } from '@angular/common/http'
import { DOCUMENT, inject, provideEnvironmentInitializer, provideZoneChangeDetection } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { bootstrapApplication } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'
import { NavigationEnd, provideRouter, Router } from '@angular/router'
import { LogLevel } from '@shiftcode/logger'
import { provideNavigationClassHandler, provideTestingFab } from '@shiftcode/ngx-components'
import {
  filterIfInstanceOf,
  ORIGIN,
  provideLocalStorage,
  provideLogger,
  withBrowserConsoleTransport,
} from '@shiftcode/ngx-core'
import { filter, map, startWith } from 'rxjs'

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
    provideTestingFab([
      {
        id: 'body-bg-color',
        label: 'Body Background',
        type: 'select-query-param',
        queryParam: 'body-bg',
        options: [
          { value: '#e0202b', label: 'red' },
          { value: '#c61c26', label: 'darkRed' },
          { value: '#e0481e', label: 'orange' },
          { value: '#bd3c19', label: 'burntOrange' },
          { value: '#eb701d', label: 'amber' },
          { value: '#ff7a20', label: 'brightOrange' },
          { value: '#e3a112', label: 'goldenrod' },
          { value: '#ffb514', label: 'sunflower' },
          { value: '#f2eb37', label: 'lemon' },
          { value: '#e3dc34', label: 'mustard' },
          { value: '#b2e255', label: 'lime' },
          { value: '#a3cf4e', label: 'oliveLime' },
          { value: '#63f1ff', label: 'cyan' },
          { value: '#4fc1cc', label: 'lightTeal' },
          { value: '#43a6b0', label: 'teal' },
          { value: '#35828a', label: 'darkTeal' },
          { value: '#256960', label: 'forestTeal' },
          { value: '#39a496', label: 'jade' },
          { value: '#2c7d73', label: 'seaGreen' },
          { value: '#35978a', label: 'turquoise' },
        ],
      },
    ]),
    provideEnvironmentInitializer(() => {
      const origin = inject(ORIGIN)
      const doc = inject(DOCUMENT)
      inject(Router)
        .events.pipe(
          takeUntilDestroyed(),
          filterIfInstanceOf(NavigationEnd),
          map((ev) => ev.urlAfterRedirects),
          startWith(inject(Router).url),
          map((path) => URL.parse(path, origin)?.searchParams?.get('body-bg') || null),
          filter((bgColor) => bgColor === null || /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(bgColor)),
        )
        .subscribe((bgColor) => {
          doc.body.style.backgroundColor = bgColor || 'unset'
        })
    }),
  ],
  // eslint-disable-next-line no-console
}).catch((err) => console.error(err))
