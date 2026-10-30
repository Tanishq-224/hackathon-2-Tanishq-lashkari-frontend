export type FormFeedbackType = 'error' | 'success' | 'info' | 'warning'

/**
 * @description Scrolls the viewport to a field wrapper marked with data-field-key.
 * @param {string} fieldKey - Stable field identifier used in markup.
 * @returns {void}
 */
export function scrollToFormField(fieldKey: string): void {
  const target = document.querySelector<HTMLElement>(`[data-field-key="${fieldKey}"]`)
  if (!target) {
    return
  }
  target.scrollIntoView({ behavior: 'smooth', block: 'center' })
  const focusable = target.querySelector<HTMLElement>(
    'input, textarea, select, button, [tabindex]:not([tabindex="-1"])',
  )
  focusable?.focus({ preventScroll: true })
}
