/** @description Visible preloader column count by viewport (matches project breakpoints). */
export type PreloaderPanelCount = 2 | 3 | 4

/**
 * @description Mobile 2 / tablet 3 / desktop 4 columns.
 * @param {number} viewportWidth - `window.innerWidth`.
 * @returns {PreloaderPanelCount}
 */
export function getPreloaderPanelCount(viewportWidth: number): PreloaderPanelCount {
  if (viewportWidth < 768) {
    return 2
  }
  if (viewportWidth < 1024) {
    return 3
  }
  return 4
}

/**
 * @description Staggered panel rise order (1-based labels → zero-based indices).
 * @param {number} panelCount - Number of visible columns.
 * @returns {number[]} Panel indices in exit sequence.
 */
export function getPreloaderPanelExitOrder(panelCount: number): number[] {
  if (panelCount === 2) {
    return [0, 1]
  }
  if (panelCount === 3) {
    return [0, 2, 1]
  }
  return [0, 2, 1, 3]
}
