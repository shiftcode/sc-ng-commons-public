/**
 * Push an item to a ring buffer array. If the buffer exceeds maxSize, the oldest entry is removed.
 * todo: use from @shiftcode/logger when available
 */
export function pushToRingBuffer<T>(buffer: T[], item: T, maxSize: number): void {
  buffer.push(item)
  if (buffer.length > maxSize) {
    buffer.shift()
  }
}
