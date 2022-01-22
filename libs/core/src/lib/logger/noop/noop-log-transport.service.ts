import { Injectable } from '@angular/core'
import { LogLevel } from '../log-level.enum'
import { LogTransport } from '../log-transport'

@Injectable({ providedIn: 'root' })
export class NoopLogTransport extends LogTransport {
  log(level: LogLevel, clazzName: string, color: string, timestamp: Date, args: any[]): void {}
}
