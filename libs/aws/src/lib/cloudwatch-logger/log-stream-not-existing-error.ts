export class LogStreamNotExisting extends Error {
  constructor(readonly logStream: string) {
    super('The LogStream does not exist')
  }
}
