import type Lenis from 'lenis'

let lenisRef: Lenis | null = null

/**
 * @description Registers the active Lenis instance from the public layout provider.
 * @param {Lenis | null} instance - Lenis instance or null on teardown.
 * @returns {void}
 */
export function registerLenisInstance(instance: Lenis | null): void {
  lenisRef = instance
}

/**
 * @description Pauses or resumes Lenis while the page reveal overlay is visible.
 * @param {boolean} locked - When true, smooth scroll stops.
 * @returns {void}
 */
export function setLenisScrollLocked(locked: boolean): void {
  if (!lenisRef) {
    return
  }
  if (locked) {
    lenisRef.stop()
  } else {
    lenisRef.start()
  }
}
