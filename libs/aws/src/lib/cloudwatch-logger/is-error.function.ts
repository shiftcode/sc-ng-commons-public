import { DataAlreadyAcceptedException, InvalidSequenceTokenException } from '@aws-sdk/client-cloudwatch-logs'
import { SmithyException } from '@aws-sdk/types/dist/types/shapes'

export function isError(value: unknown): value is { name: string; message: string } {
  return (
    value instanceof Error || (typeof value === 'object' && value !== null && 'name' in value && 'message' in value)
  )
}

export function isDataAlreadyAcceptedException(err: unknown): err is DataAlreadyAcceptedException {
  return isSmithyException(err) && err.name === 'DataAlreadyAcceptedException'
}

export function isInvalidSequenceTokenException(err: unknown): err is InvalidSequenceTokenException {
  return isSmithyException(err) && err.name === 'InvalidSequenceTokenException'
}

/** AWS errors are smithy exceptions. */
function isSmithyException(err: unknown): err is SmithyException {
  return typeof err === 'object' && err !== null && 'name' in err && '$fault' in err
}
