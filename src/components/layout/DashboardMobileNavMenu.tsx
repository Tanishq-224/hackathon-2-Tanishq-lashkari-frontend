import { Check, Home, LogOut, Menu, X, type LucideIcon } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { Link, NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { getProfileInitials } from '@/hooks/useAuthSession'
import { cn } from '@/lib/utils'

/** @description Duration of mobile menu close animation in milliseconds. */
const MOBILE_NAV_ANIMATION_MS = 320

export type DashboardNavItem = {
  label: string
  to: string
  icon: LucideIcon
  end?: boolean
}

type DashboardMobileNavMenuProps = {
  navItems: DashboardNavItem[]
  roleLabel: string
  userFullName?: string
  userEmail?: string
  onLogout: () => void
  className?: string
}

/**
 * @description Builds class names for mobile drawer workspace links.
 * @param {{ isActive: boolean }} state - React Router active state.
 * @returns {string} Tailwind class string.
 */
function mobileNavLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    'public-mobile-nav-link flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-body font-medium transition-all duration-200',
    isActive
      ? 'bg-primary font-semibold text-primary-foreground shadow-[0_8px_24px_-8px] shadow-primary/50 ring-2 ring-primary/35'
      : 'text-foreground/75 hover:bg-muted/90 hover:text-foreground dark:text-white/85 dark:hover:bg-white/10 dark:hover:text-white',
  )
}

/**
 * @description Hamburger drawer for dashboard workspace actions on phones and tablets.
 */
export function DashboardMobileNavMenu({
  navItems,
  roleLabel,
  userFullName,
  userEmail,
  onLogout,
  className,
}: DashboardMobileNavMenuProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const closeTimerRef = useRef<number | null>(null)
  const panelId = useId()

  const handleClose = useCallback(() => {
    setOpen(false)
    closeTimerRef.current = window.setTimeout(() => {
      setMounted(false)
      closeTimerRef.current = null
    }, MOBILE_NAV_ANIMATION_MS)
  }, [])

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
    <div className={cn('lg:hidden', className)}>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close workspace menu' : 'Open workspace menu'}
        onClick={() => {
          if (open) {
            handleClose()
          } else {
            handleOpen()
          }
        }}
        className="size-9 shrink-0 rounded-xl border-primary/35 bg-background/70 text-foreground transition duration-200 dark:border-primary/45 dark:bg-white/5 dark:text-white"
      >
        {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
      </Button>

      {mounted ? (
        <button
          type="button"
          aria-label="Close menu backdrop"
          className={cn(
            'public-mobile-nav-backdrop fixed inset-x-0 bottom-0 top-16 z-[var(--z-mobile-nav)] bg-black/55 backdrop-blur-[2px]',
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
          aria-label="Workspace menu"
          aria-hidden={!open}
          className={cn(
            'public-mobile-nav-panel fixed inset-x-3 top-[4.25rem] z-[calc(var(--z-mobile-nav)+1)] max-h-[min(36rem,calc(100dvh-5rem))] overflow-y-auto rounded-2xl border border-border/90 bg-card/95 p-4 shadow-2xl backdrop-blur-xl sm:inset-x-5 dark:bg-[#2a2d33]/95',
            open ? 'public-mobile-nav-panel--open' : 'public-mobile-nav-panel--closed',
          )}
        >
          <p className="mb-3 px-1 text-caption font-semibold uppercase tracking-wider text-muted-foreground">
            {roleLabel}
          </p>

          <nav aria-label="Workspace mobile" className="flex flex-col gap-1.5">
            {navItems.map(({ to, label, icon: Icon, end }, index) => (
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
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-3">
                      <Icon aria-hidden className="size-4 shrink-0 opacity-90" />
                      {label}
                    </span>
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-foreground/15 px-2 py-0.5 text-caption font-semibold text-primary-foreground">
                        <Check aria-hidden className="size-3.5" strokeWidth={2.5} />
                        Current
                      </span>
                    ) : null}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="mt-5 space-y-3 border-t border-border/80 pt-5 dark:border-white/10">
            <Link
              to="/"
              onClick={handleClose}
              className="public-mobile-nav-link flex items-center gap-3 rounded-xl px-4 py-3.5 text-body font-medium text-foreground/75 transition hover:bg-muted/90 hover:text-foreground dark:text-white/85 dark:hover:bg-white/10"
            >
              <Home aria-hidden className="size-4 shrink-0" />
              Public site
            </Link>

            <Link
              to="/dashboard/profile"
              onClick={handleClose}
              className="flex items-center gap-3 rounded-xl border border-border/80 bg-secondary/30 px-4 py-3 transition hover:border-primary/35 hover:bg-secondary/50"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                {userFullName ? getProfileInitials(userFullName) : '?'}
              </div>
              <div className="min-w-0 text-left">
                <p className="truncate text-ui font-semibold text-foreground">{userFullName}</p>
                <p className="truncate text-caption text-muted-foreground">{userEmail}</p>
              </div>
            </Link>

            <Button
              type="button"
              variant="outline"
              className="w-full justify-center gap-2 font-medium"
              onClick={() => {
                handleClose()
                onLogout()
              }}
            >
              <LogOut aria-hidden className="size-4" />
              Log out
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
