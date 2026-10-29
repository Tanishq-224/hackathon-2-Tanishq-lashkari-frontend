/**
 * @description Detects Jest / CI test runs where GSAP scroll effects should stay disabled.
 * @returns {boolean} True when running under the test environment.
 */
export function isTestEnv(): boolean {
  if (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'test') {
    return true
  }

  return process.env.NODE_ENV === 'test'
}
