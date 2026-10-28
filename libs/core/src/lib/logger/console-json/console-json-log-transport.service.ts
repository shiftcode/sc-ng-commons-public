import { inject, InjectionToken, Service } from '@angular/core'
import { LogLevel } from '@shiftcode/logger'
import { ConsoleJsonLogTransport, ConsoleJsonLogTransportConfig } from '@shiftcode/logger'

export { ConsoleJsonLogTransportConfig } from '@shiftcode/logger'

export const CONSOLE_JSON_LOG_TRANSPORT_CONFIG = new InjectionToken<ConsoleJsonLogTransportConfig>(
  'CONSOLE_JSON_LOG_TRANSPORT_CONFIG',
  { factory: () => ({ logLevel: LogLevel.DEBUG }) },
)

@Service()
export class ConsoleJsonLogTransportService extends ConsoleJsonLogTransport {
  constructor() {
    super(inject(CONSOLE_JSON_LOG_TRANSPORT_CONFIG))
  }
}
