import { JsonLogObjectData } from '@shiftcode/logger'

export interface RemoteLogData extends JsonLogObjectData {
  requestInfo?: Record<string, string | undefined | null>
}
