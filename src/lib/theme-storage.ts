/** @description localStorage key for persisted color theme preference. */
export const THEME_STORAGE_KEY = 'repairex-theme'

/** @description Supported theme preference values. */
export type ThemePreference = 'light' | 'dark' | 'system'

/** @description Resolved theme applied to the document. */
export type ResolvedTheme = 'light' | 'dark'

/**
 * @description Reads the stored theme preference from localStorage.
 * @returns {ThemePreference} Stored preference or `system` when missing/invalid.
 */
export function readStoredTheme(): ThemePreference {
  if (typeof window === 'undefined') {
    return 'system'
  }

  const stored = localStorage.getItem(THEME_STORAGE_KEY)

  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }

  return 'dark'
}

/**
 * @description Persists the user's theme preference.
 * @param {ThemePreference} theme - Preference to store.
 * @returns {void}
 */
export function writeStoredTheme(theme: ThemePreference): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme)
}

/**
 * @description Resolves `system` to light or dark using OS preference.
 * @param {ThemePreference} preference - User-selected preference.
 * @returns {ResolvedTheme} Theme class to apply on `<html>`.
 */
export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === 'light' || preference === 'dark') {
    return preference
  }

  if (typeof window === 'undefined') {
    return 'light'
  }

  if (typeof window.matchMedia !== 'function') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/**
 * @description Applies the resolved theme class on the document root.
 * @param {ResolvedTheme} resolved - Active light or dark theme.
 * @returns {void}
 */
export function applyDocumentTheme(resolved: ResolvedTheme): void {
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}
