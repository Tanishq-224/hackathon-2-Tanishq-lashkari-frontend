export const REPAIREX_SCROLL_LOCK_EVENT = 'repairex-scroll-lock'

export type RepairexScrollLockDetail = {
  locked: boolean
}

/**
 * @description Pauses Lenis while scroll-expansion heroes capture the wheel at page top.
 * @param {boolean} locked - When true, root smooth scroll should stop.
 * @returns {void}
 */
export function dispatchRepairexScrollLock(locked: boolean): void {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(
    new CustomEvent<RepairexScrollLockDetail>(REPAIREX_SCROLL_LOCK_EVENT, {
      detail: { locked },
    }),
  )
}
