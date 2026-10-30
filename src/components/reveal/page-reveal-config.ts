import { isTestEnv } from '@/lib/is-test-env'

/** @description How often the public page reveal runs. */
export type PageRevealMode = 'once-per-session' | 'every-load' | 'off'

export type PageRevealConfig = {
  mode: PageRevealMode
  /** When false, login/signup/OTP/password routes skip the reveal. */
  includeAuthRoutes: boolean
  /** Optional reveal on client-side public route changes (default off). */
  enableRouteTransitions: boolean
  words: readonly string[]
  /** Target total timeline length (seconds); tuned in PageReveal. */
  totalDurationSec: number
  fallbackTimeoutMs: number
  reducedMotionFadeMs: number
  sessionStorageKey: string
  /** Exact paths that trigger reveal on full page load. */
  publicPaths: readonly string[]
}

export const PAGE_REVEAL_CONFIG: PageRevealConfig = {
  mode: 'once-per-session',
  includeAuthRoutes: false,
  enableRouteTransitions: false,
  words: ['Repairs', 'Care', 'Trust', 'Experience'],
  totalDurationSec: 6.5,
  fallbackTimeoutMs: 9000,
  reducedMotionFadeMs: 250,
  sessionStorageKey: 'repairex-page-reveal-v2',
  publicPaths: ['/', '/about', '/contact'],
}

const AUTH_PATHS = new Set([
  '/login',
  '/signup',
  '/verify-otp',
  '/forgot-password',
  '/reset-password',
])

/**
 * @description Whether the given pathname is eligible for the reveal overlay.
 * @param {string} pathname - Current location pathname.
 * @param {PageRevealConfig} [config] - Reveal configuration.
 * @returns {boolean}
 */
export function isRevealEligiblePath(
  pathname: string,
  config: PageRevealConfig = PAGE_REVEAL_CONFIG,
): boolean {
  if (config.publicPaths.includes(pathname)) {
    return true
  }
  if (config.includeAuthRoutes && AUTH_PATHS.has(pathname)) {
    return true
  }
  return false
}

/**
 * @description Session / mode gate (safe for SSR and private mode).
 * @param {PageRevealConfig} [config] - Reveal configuration.
 * @returns {boolean} True when reveal should run on this full page load.
 */
/**
 * @description Dev-only: `?pageReveal` or `?pageReveal=1` clears session and forces the reveal.
 * @returns {boolean}
 */
export function shouldForcePageRevealReplay(): boolean {
  if (import.meta.env?.DEV !== true || typeof window === 'undefined') {
    return false
  }
  const params = new URLSearchParams(window.location.search)
  return params.has('pageReveal')
}

/**
 * @description Resets module-level GSAP guard (Vite HMR can leave this stuck across hot updates).
 * @returns {void}
 */
export function resetPageRevealRuntimeState(): void {
  if (typeof window === 'undefined') {
    return
  }
  window.dispatchEvent(new CustomEvent('repairex:page-reveal-reset-runtime'))
}

export function shouldRunPageRevealForSession(
  config: PageRevealConfig = PAGE_REVEAL_CONFIG,
): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  const isDev = import.meta.env?.DEV === true
  const mode =
    isDev && config.mode === 'once-per-session' ? 'every-load' : config.mode

  if (mode === 'off' || isTestEnv()) {
    return false
  }
  if (shouldForcePageRevealReplay()) {
    try {
      sessionStorage.removeItem(config.sessionStorageKey)
    } catch {
      // ignore
    }
    resetPageRevealRuntimeState()
    return true
  }
  if (mode === 'once-per-session') {
    try {
      if (sessionStorage.getItem(config.sessionStorageKey) === '1') {
        return false
      }
    } catch {
      // sessionStorage blocked — still allow reveal once per load
    }
  }
  return true
}

/**
 * @description Marks reveal complete for once-per-session mode.
 * @param {PageRevealConfig} [config] - Reveal configuration.
 * @returns {void}
 */
export function markPageRevealSessionComplete(
  config: PageRevealConfig = PAGE_REVEAL_CONFIG,
): void {
  if (config.mode !== 'once-per-session') {
    return
  }
  try {
    sessionStorage.setItem(config.sessionStorageKey, '1')
  } catch {
    // ignore
  }
}
