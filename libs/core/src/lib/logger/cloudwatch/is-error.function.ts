export function isLogStreamNotFoundError(err: any): boolean {
  if ('status' in err && 'error' in err && err.status === 400 && typeof err.error === 'string') {
    try {
      const parsed = JSON.parse(err.error)
      return parsed?.error === 'ResourceNotFoundException'
    } catch {
      return false
    }
  }
  return false
}
