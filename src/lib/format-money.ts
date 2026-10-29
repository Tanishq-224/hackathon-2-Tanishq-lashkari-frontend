/**
 * @description Coerces API/Mongo numeric fields to a finite number for display.
 * @param {unknown} value - Raw amount from JSON or form state.
 * @returns {number} Safe finite number (0 when invalid).
 */
export function coerceMoneyAmount(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number.parseFloat(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return 0
}

/**
 * @description Formats a currency amount for UI (USD, two decimals).
 * @param {unknown} value - Raw amount.
 * @returns {string} e.g. "$105.00"
 */
export function formatUsd(value: unknown): string {
  return `$${coerceMoneyAmount(value).toFixed(2)}`
}
