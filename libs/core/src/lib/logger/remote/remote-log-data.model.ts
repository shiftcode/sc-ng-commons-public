export interface RemoteLogData {
  level: string
  timestamp: string
  logger: string
  requestInfo: Record<string, string>
  message?: string
  errorName?: string
  exception?: string | undefined
  data?: string | undefined
}
