/**
 * @description Detects Jest / CI test runs where GSAP scroll effects should stay disabled.
 * @returns {boolean} True when running under the test environment.
 */
type TestGlobal = typeof globalThis & { __REPAIREX_TEST__?: boolean }

export function isTestEnv(): boolean {
  if (typeof globalThis !== 'undefined' && (globalThis as TestGlobal).__REPAIREX_TEST__) {
    return true
  }

  return import.meta.env?.MODE === 'test'
}
