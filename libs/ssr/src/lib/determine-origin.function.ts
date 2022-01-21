import { isPlatformServer } from '@angular/common'
import { isAwsLambdaEnv } from './aws-helper.function'
import { Request } from 'express'

export function determineOrigin(platformId: any, request?: Request): string {
  if (isPlatformServer(platformId) && request) {
    // final url differs from api gateway endpoint
    // we have to add the port to the hostname if we're running local
    const domain = isAwsLambdaEnv() ? process.env['FINAL_DOMAIN'] : `${request.hostname}:4000`
    if (!domain || domain === '') {
      throw new Error('env var FINAL_DOMAIN was not set or is empty')
    }
    const protocol = isAwsLambdaEnv() ? 'https' : request.protocol
    return `${protocol}://${domain}`
  } else {
    throw new Error('can not determinate the origin - make sure the module is only applied for SSR?')
  }
}
