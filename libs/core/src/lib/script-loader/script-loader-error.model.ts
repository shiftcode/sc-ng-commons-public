export class ScriptLoaderError extends Error {
  readonly scriptUrl: string
  readonly cause?: unknown

  constructor(message: string, scriptUrl: string, cause?: unknown) {
    super(message)
    this.scriptUrl = scriptUrl
    this.cause = cause
  }
}
