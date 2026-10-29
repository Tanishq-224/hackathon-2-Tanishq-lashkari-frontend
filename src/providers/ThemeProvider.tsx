import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  applyDocumentTheme,
  readStoredTheme,
  resolveTheme,
  writeStoredTheme,
  type ResolvedTheme,
  type ThemePreference,
} from '@/lib/theme-storage'

type ThemeContextValue = {
  theme: ThemePreference
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemePreference) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

type ThemeProviderProps = {
  children: ReactNode
}

/**
 * @description Provides light/dark/system theme state and syncs the `dark` class on `<html>`.
 * @param {ThemeProviderProps} props - Child components.
 * @returns {JSX.Element} Theme context provider.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemePreference>(() =>
    readStoredTheme(),
  )
  const [systemDark, setSystemDark] = useState(
    () => resolveTheme('system') === 'dark',
  )

  const resolvedTheme = useMemo<ResolvedTheme>(() => {
    if (theme === 'light' || theme === 'dark') {
      return theme
    }
    return systemDark ? 'dark' : 'light'
  }, [theme, systemDark])

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next)
    writeStoredTheme(next)
    applyDocumentTheme(next === 'system' ? resolveTheme('system') : next)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  useEffect(() => {
    applyDocumentTheme(resolvedTheme)
  }, [resolvedTheme])

  useEffect(() => {
    if (theme !== 'system') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')

    /**
     * @description Updates system-derived theme when OS preference changes.
     * @returns {void}
     */
    const onChange = () => {
      setSystemDark(media.matches)
    }

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [theme])

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * @description Accesses theme preference and controls from `ThemeProvider`.
 * @returns {ThemeContextValue} Theme context value.
 * @throws {Error} When used outside `ThemeProvider`.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return context
}
