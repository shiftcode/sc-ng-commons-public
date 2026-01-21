/**
 * Time formatter for logging timestamps in 'HH:MM:SS.sss' format.
 */
export const loggingTimeFormat = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  fractionalSecondDigits: 3,
  hour12: false,
})
