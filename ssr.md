# @shiftcode/ngx-ssr ![@shiftcode/ngx-ssr](https://img.shields.io/badge/deprecated-f48700)

**Our Package is not used anymore starting with Angular 17.**\
Instead take the following actions when migrating to Angular ^17:

- ensure AppComponent is a standalone component and not declared in a module
- remove the usage of `SsrHttpInterceptor` and `provideOrigin` (both from `@shiftcode/ngx-core` and `@shiftcode/ngx-ssr` package)\
  _(Injection token `CLIENT_CONFIG` (from `@shiftcode/ngx-core` package) can still be used)_
- when configuring the new `CommonEngine` from `@angular/ssr` you have to set the `url` and provide the `APP_BASE_HREF`.\
  see below:

### `/src/app/app.config.ts`
```ts
import { provideHttpClient, withFetch } from '@angular/common/http'
import { APP_ID, ApplicationConfig } from '@angular/core'
import { provideClientHydration } from '@angular/platform-browser'

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_ID, useValue: 'sc' },
    
    /** this new provider from @angular/ssr can be used to rehydrate the app. might introduce problems. */
    provideClientHydration(), 
    
    /** we can make use of the modern fetch api which is available in the browser and node */
    provideHttpClient(withFetch()),
    
    /* other providers used in the app */
  ]
}
```


### `/src/main.server.ts`
export a bootstrap function which provides the `provideServerRendering` providers 
```ts
import { bootstrapApplication, provideServerRendering } from '@angular/platform-browser'
import { AppComponent } from './app/app.component'
import { appConfig } from './app/app.config'

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    /* other special providers like LogTransport etc. for ssr usage only */
  ]
}

const bootstrap = () => bootstrapApplication(
  AppComponent,
  mergeApplicationConfig(appConfig, serverConfig), // merge config with the appConfig
)

export default bootstrap
```

### `/server.ts`
```ts
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { APP_BASE_HREF } from '@angular/common'
import { CommonEngine } from '@angular/ssr'
import express from 'express'
import bootstrap from './src/main.server'

export function createSsrApp(localExecution: boolean = false): express.Express {
  const server = express()
  const serverDistFolder = dirname(fileURLToPath(import.meta.url))
  const browserDistFolder = resolve(serverDistFolder, '../browser')
  const indexHtml = join(serverDistFolder, 'index.server.html')

  server.set('view engine', 'html')
  server.set('views', browserDistFolder)

  if (localExecution) {
    // Serve static files from /browser when executed locally
    server.get('*.*', express.static(browserDistFolder, { maxAge: '1y' }))
  } else {
    server.use((req, res, next) => {
      res.setHeader('Cache-Control', ['max-age=0, s-maxage=31104000'])
      next()
    })
  }

  const commonEngine = new CommonEngine()

  server.get('*', (req, res, next) => {
    const { protocol, originalUrl: path, baseUrl, headers } = req
    // with the ApiGateway we set the x-host header to the actual host
    const host = headers['x-host'] ?? headers['host']
    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${host}${path}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err))
  })

  return server
}
```

### `/ssr-fn.ts`
```ts
import { createServer, proxy } from 'aws-serverless-express'
import { createSsrApp } from './server'

const BIN_MIME_TYPES = [
  'application/javascript',
  'application/json',
  'application/octet-stream',
  'application/xml',
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/comma-separated-values',
  'text/css',
  'text/javascript',
  'text/plain',
  'text/text',
  'text/xml',
  'image/x-icon',
  'image/svg+xml',
  'application/x-font-ttf',
]

const app = createSsrApp(false)
const server = createServer(app, () => {}, BIN_MIME_TYPES)
export const handler = (event: any, context: any) => proxy(server, event, context)

```
