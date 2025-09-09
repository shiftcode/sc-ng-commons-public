export type LogRequestInfo = Record<string, string | undefined | null>

export interface LogRequestInfoFn {
  (): LogRequestInfo
}
