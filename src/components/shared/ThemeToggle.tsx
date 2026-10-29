import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/providers/ThemeProvider'
import { cn } from '@/lib/utils'

type ThemeToggleProps = {
  className?: string
}

/**
 * @description Switches between light and dark themes for public and app shells.
 * @param {ThemeToggleProps} props - Optional class names for the toggle button.
 * @returns {JSX.Element} Accessible theme toggle button.
 */
export function ThemeToggle({ className }: ThemeToggleProps = {}) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggleTheme}
      className={cn(className)}
    >
      {isDark ? <Sun aria-hidden /> : <Moon aria-hidden />}
    </Button>
  )
}
