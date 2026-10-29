import { Menu, X } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { NavLink } from 'react-router-dom'

import { PublicAccountActions } from '@/components/layout/PublicAccountActions'
import { PUBLIC_PRIMARY_NAV_LINKS } from '@/components/layout/public-nav-links'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** @description Duration of mobile menu close animation in milliseconds. */
const MOBILE_NAV_ANIMATION_MS = 320

type PublicMobileNavMenuProps = {
  className?: string
}

/**
 * @description Builds class names for mobile drawer navigation links.
 * @param {{ isActive: boolean }} state - React Router active state.
 * @returns {string} Tailwind class string.
 */
function mobileNavLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    'public-mobile-nav-link block rounded-xl px-4 py-3.5 text-body font-medium transition-colors duration-200',
    isActive
      ? 'bg-primary/15 text-foreground dark:bg-primary/20 dark:text-white'
      : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground dark:text-white/80 dark:hover:bg-white/8 dark:hover:text-white',
  )
}

/**
 * @description Hamburger-triggered navigation drawer for phones and small tablets.
 * @param {PublicMobileNavMenuProps} props - Optional wrapper classes.
 * @returns {JSX.Element} Mobile menu control and panel.
 */
export function PublicMobileNavMenu({ className }: PublicMobileNavMenuProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const closeTimerRef = useRef<number | null>(null)
  const panelId = useId()

  /**
   * @description Closes the mobile navigation drawer with exit animation.
   * @returns {void}
   */
  const handleClose = useCallback(() => {
    setOpen(false)
    closeTimerRef.current = window.setTimeout(() => {
      setMounted(false)
      closeTimerRef.current = null
    }, MOBILE_NAV_ANIMATION_MS)
  }, [])

  /**
   * @description Opens the mobile navigation drawer with enter animation.
   * @returns {void}
   */
  const handleOpen = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setMounted(true)
    window.requestAnimationFrame(() => {
      setOpen(true)
    })
  }, [])

  useEffect(() => {
    if (!mounted) {
      document.documentElement.classList.remove('public-mobile-nav-open')
      return undefined
    }

    document.documentElement.classList.add('public-mobile-nav-open')
    return () => {
      document.documentElement.classList.remove('public-mobile-nav-open')
    }
  }, [mounted])

  useEffect(() => {
    if (!open) {
      return undefined
    }

    /**
     * @description Closes the drawer when the visitor presses Escape.
     * @param {KeyboardEvent} event - Keyboard event.
     * @returns {void}
     */
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, handleClose])

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  return (
    <div className={cn('md:hidden', className)}>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => {
          if (open) {
            handleClose()
          } else {
            handleOpen()
          }
        }}
        className="size-9 rounded-xl border-primary/35 bg-background/70 text-foreground transition duration-200 dark:border-primary/45 dark:bg-white/5 dark:text-white"
      >
        {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
      </Button>

      {mounted ? (
        <button
          type="button"
          aria-label="Close menu backdrop"
          className={cn(
            'public-mobile-nav-backdrop fixed inset-x-0 bottom-0 top-[4.25rem] z-[var(--z-mobile-nav)] bg-black/40',
            open ? 'public-mobile-nav-backdrop--open' : 'public-mobile-nav-backdrop--closed',
          )}
          onClick={handleClose}
        />
      ) : null}

      {mounted ? (
        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          aria-hidden={!open}
          className={cn(
            'public-mobile-nav-panel theme-navbar-bar fixed inset-x-3 top-[4.75rem] z-[calc(var(--z-mobile-nav)+1)] max-h-[min(32rem,calc(100dvh-5.5rem))] overflow-y-auto rounded-2xl border p-4 shadow-xl sm:inset-x-5',
            open ? 'public-mobile-nav-panel--open' : 'public-mobile-nav-panel--closed',
          )}
        >
          <nav aria-label="Primary mobile" className="flex flex-col gap-1">
            {PUBLIC_PRIMARY_NAV_LINKS.map(({ to, label, end }, index) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={mobileNavLinkClass}
                style={
                  open
                    ? ({
                        ['--nav-link-delay' as string]: `${index * 45}ms`,
                      } as CSSProperties)
                    : undefined
                }
                onClick={handleClose}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/80 pt-4 dark:border-white/10">
            <span className="text-ui font-medium text-muted-foreground">Theme</span>
            <ThemeToggle className="rounded-xl border-primary/35 bg-background/70 dark:border-primary/45 dark:bg-white/5" />
          </div>

          <div className="mt-4">
            <PublicAccountActions
              appearance="primary"
              className="flex w-full justify-center px-5"
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
