import { Link, NavLink } from 'react-router-dom'

import { Container } from '@/components/shared/Container'
import { cn } from '@/lib/utils'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'text-ui font-medium transition-colors',
    isActive ? 'text-signal-orange' : 'text-slate-grey hover:text-graphite',
  )

/**
 * @description Shared navigation bar for public marketing pages.
 * @returns {JSX.Element} Public site header with primary routes.
 */
export function PublicNavbar() {
  return (
    <header className="border-b border-warm-stone bg-off-white/95 backdrop-blur-sm">
      <Container className="flex h-14 items-center justify-between sm:h-16">
        <Link
          to="/"
          className="font-display text-h3 font-bold text-signal-orange"
        >
          Repairex
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-6">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>
      </Container>
    </header>
  )
}
