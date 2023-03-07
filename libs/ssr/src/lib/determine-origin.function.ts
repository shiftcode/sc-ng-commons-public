import { isPlatformServer } from '@angular/common'
import { isAwsLambdaEnv } from './aws-helper.function'
import { inject, PLATFORM_ID } from '@angular/core'
import { REQUEST } from '@nguniversal/express-engine/tokens'

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
    return `https://${domain}`
  } else {
    const request = inject(REQUEST)
    // we have to add the port to the hostname if we're running local
    return `${request.protocol}://${request.hostname}:4000` // FIXME: use the actual port
  }
}
