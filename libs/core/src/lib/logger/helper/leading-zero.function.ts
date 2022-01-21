/**
 * add leading zero fn
 */
export function leadingZero(length: 2 | 3 | 4, num: number) {
  const int = num.toFixed(0)
  return `000${int}`.substr(int.length + 3 - length)
}
