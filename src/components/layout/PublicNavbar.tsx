import { Link, NavLink, useLocation } from 'react-router-dom'

import { PublicAccountActions } from '@/components/layout/PublicAccountActions'
import { PublicMobileNavMenu } from '@/components/layout/PublicMobileNavMenu'
import { PUBLIC_PRIMARY_NAV_LINKS } from '@/components/layout/public-nav-links'
import { RepairexBrandMark } from '@/components/layout/RepairexBrandMark'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { cn } from '@/lib/utils'

/**
 * @description Builds class names for desktop inline navigation links.
 * @param {{ isActive: boolean }} state - React Router active state.
 * @returns {string} Tailwind class string.
 */
function desktopNavLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    'rounded-lg px-3 py-2 text-ui font-medium transition-colors duration-200',
    isActive
      ? 'bg-foreground/8 text-foreground dark:bg-white/10 dark:text-white'
      : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground dark:text-white/75 dark:hover:bg-white/8 dark:hover:text-white',
  )
}

/**
 * @description Top navigation bar for public pages with a mobile hamburger menu.
 * @returns {JSX.Element} Public site header with primary routes and log in.
 */
export function PublicNavbar() {
  const { pathname } = useLocation()

  return (
    <header className="theme-navbar-layer pointer-events-none fixed inset-x-0 top-0 z-[var(--z-navbar)] px-4 pt-3 sm:px-6 sm:pt-4">
      <div className="theme-navbar-bar pointer-events-auto mx-auto flex h-14 w-full max-w-[88rem] items-center justify-between gap-3 rounded-2xl border px-4 sm:h-[3.75rem] sm:px-5">
        <Link
          to="/"
          className="flex min-w-0 shrink-0 items-center gap-2.5 transition-opacity hover:opacity-90 sm:gap-3"
        >
          <RepairexBrandMark className="size-9 sm:size-10" />
          <span className="font-display truncate text-h3 font-bold tracking-tight text-foreground dark:text-white">
            Repairex
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <nav aria-label="Primary" className="flex items-center gap-0.5 pr-1">
            {PUBLIC_PRIMARY_NAV_LINKS.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className={desktopNavLinkClass}>
                {label}
              </NavLink>
            ))}
          </nav>

          <ThemeToggle className="rounded-xl border-primary/35 bg-background/70 text-foreground hover:bg-background dark:border-primary/45 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:hover:text-white" />
          <PublicAccountActions appearance="bar" />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle className="size-9 rounded-xl border-primary/35 bg-background/70 text-foreground dark:border-primary/45 dark:bg-white/5 dark:text-white" />
          <PublicMobileNavMenu key={pathname} />
        </div>
      </div>
    </header>
  )
}
