export abstract class LogRequestInfoProvider {
  abstract getRequestInfo(): Record<string, string>
}
