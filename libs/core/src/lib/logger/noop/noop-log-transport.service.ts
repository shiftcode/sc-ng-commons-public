import { Injectable } from '@angular/core'
import { LogLevel } from '../log-level.enum'
import { LogTransport } from '../log-transport'

@Injectable({ providedIn: 'root' })
export class NoopLogTransport extends LogTransport {
  log(_level: LogLevel, _clazzName: string, _color: string, _timestamp: Date, _args: any[]): void {}
}
