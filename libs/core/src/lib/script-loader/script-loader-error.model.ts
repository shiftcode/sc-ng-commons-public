export class ScriptLoaderError extends Error {
  readonly scriptUrl: string

  constructor(message: string, scriptUrl: string, cause?: unknown) {
    super(message)
    this.scriptUrl = scriptUrl
    this.cause = cause
  }
}
