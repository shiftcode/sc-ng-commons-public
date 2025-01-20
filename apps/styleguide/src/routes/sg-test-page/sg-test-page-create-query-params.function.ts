import { SgTestRouteQueryParams } from './sg-test-route-query-params.enum'

export function sgTestPageCreateQueryParams(delay: number, disallow: boolean = false) {
  return {
    [SgTestRouteQueryParams.DELAY]: delay,
    [SgTestRouteQueryParams.DISALLOW]: disallow,
  }
}
