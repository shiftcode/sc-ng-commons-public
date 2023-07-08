import { isPlatformServer } from '@angular/common'
import { isAwsLambdaEnv } from './aws-helper.function'
import { inject, PLATFORM_ID } from '@angular/core'
import { REQUEST } from '@nguniversal/express-engine/tokens'
import type { Request } from 'express'

/**
 *  determines the origin when running on platform server.
 *  reads the provided env variable when {@link isAwsLambdaEnv} or uses the protocol+hostname+port_4000
 */
export function determineOrigin(envVarName: string = 'FINAL_DOMAIN') {
  if (!isPlatformServer(inject(PLATFORM_ID))) {
    throw new Error('can not determine the origin. Ensure the this factory function is only used for SSR.')
  }
  if (isAwsLambdaEnv()) {
    // final url differs from api gateway endpoint
    const domain = process.env[envVarName]
    if (!domain || domain === '') {
      throw new Error(`env var ${envVarName} was not set or is empty`)
    }
    return `https://${domain}`.replace(/\/$/, '') // ensure no trailing slash
  } else {
    const request: Request = inject(REQUEST)
    // hacky - but as it's only used locally and as it falls back to 4000 it's acceptable
    // + it will be logged to the console
    const port = Number(request.headers?.['x-forwarded-port']) || 4000
    return `${request.protocol}://${request.hostname}:${port}` // no-trailing slash
  }
}
