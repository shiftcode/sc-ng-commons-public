import { provideHttpClient } from '@angular/common/http'
import { bootstrapApplication } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import { AppComponent } from './app/app.component'
import { provideSgConfig } from './provide-sg-config'
import { ROUTES } from './routes/routes.const'

bootstrapApplication(AppComponent, {
  providers: [
    provideSgConfig(),
    provideHttpClient(),
    provideAnimations(),
    provideRouter(ROUTES),
  ],
})
  // tslint:disable-next-line:no-console
  .catch((err) => console.error(err))
