import { describe, expect, test } from 'vitest'

import { loggingTimeFormat } from './logging-time-format.const'

describe('timeFormat', () => {
  test('should format time as HH:mm:ss.SSS', () => {
    const timestamp = new Date('2024-01-15T14:30:45.123')
    expect(loggingTimeFormat.format(timestamp)).toBe(`14:30:45.123`)
  })

  test('should format another time as HH:mm:ss.SSS', () => {
    const timestamp = new Date('2024-01-01T23:59:59.999')
    expect(loggingTimeFormat.format(timestamp)).toBe(`23:59:59.999`)
  })

  test('should format time with leading zeros as HH:mm:ss.SSS', () => {
    const timestamp = new Date('2024-01-01T01:02:03.004')
    expect(loggingTimeFormat.format(timestamp)).toBe(`01:02:03.004`)
  })
})
