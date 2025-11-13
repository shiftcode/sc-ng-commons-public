import { inject, PLATFORM_ID, Provider } from '@angular/core'
import { ORIGIN } from './origin.token'
import { isPlatformServer } from '@angular/common'

declare const process: { env: Record<string, undefined | string> }

/**
 * Provides the {@link ORIGIN} token from the environment variable.
 */
export function provideOriginFromEnv(key: string): Provider[] {
  return [
    {
      provide: ORIGIN,
      useFactory: () => {
        if (!isPlatformServer(inject(PLATFORM_ID))) {
          throw new Error(`${provideOriginFromEnv.name} can only be used on the server`)
        }

        const value = process.env[key]?.trim()
        if (!value) {
          throw new Error(`Env var ${key} needs to be defined`)
        }
        try {
          new URL(value)
          return value
        } catch (error) {
          throw new Error(`Env var ${key} is not a valid origin: ${value}`, { cause: error })
        }
      },
    },
  ]
}
