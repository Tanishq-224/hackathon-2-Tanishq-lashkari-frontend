import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  Home,
  PlusCircle,
  Wrench,
} from 'lucide-react'

import { PublicNavbar } from './PublicNavbar'
import { useAuthSession } from '@/hooks/useAuthSession'

/**
 * @description Dedicated Dashboard Layout with common PublicNavbar, desktop sidebar, and mobile bottom nav.
 * @returns {JSX.Element}
 */
export function DashboardLayout() {
  const { isAuthenticated, isLoading } = useAuthSession()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-ui text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  const navItems = [
    {
      label: 'My Repairs',
      to: '/dashboard',
      icon: Wrench,
      active: location.pathname === '/dashboard',
    },
    {
      label: 'New Request',
      to: '/dashboard/new-repair',
      icon: PlusCircle,
      active: location.pathname === '/dashboard/new-repair',
    },
  ]

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      {/* Common Navbar across public and dashboard */}
      <PublicNavbar />

      {/* Main Body offset below fixed navbar */}
      <div className="flex flex-1 pt-[4.75rem] sm:pt-24">
        {/* Desktop Sidebar (1024px+) */}
        <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-border bg-card/40 p-4 lg:flex">
          <div className="space-y-6">
            <div className="px-3 py-2">
              <p className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
                Workspace
              </p>
            </div>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-ui font-medium transition ${
                      item.active
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="border-t border-border pt-4">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-ui text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Public Site</span>
            </Link>
          </div>
        </aside>

        {/* Content Outlet with bottom padding on mobile so bottom nav never covers content */}
        <main className="flex-1 overflow-x-hidden p-4 pb-24 md:p-8 md:pb-12 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile / Tablet Bottom Navigation Bar (<1024px) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border bg-card/95 px-2 backdrop-blur-md lg:hidden"
        aria-label="Mobile Navigation"
      >
        <Link
          to="/dashboard"
          className={`flex flex-col items-center gap-1 py-1 text-[11px] font-medium transition ${
            location.pathname === '/dashboard'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Wrench className="h-5 w-5" />
          <span>Repairs</span>
        </Link>

        <Link
          to="/dashboard/new-repair"
          className={`flex flex-col items-center gap-1 py-1 text-[11px] font-medium transition ${
            location.pathname === '/dashboard/new-repair'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <PlusCircle className="h-5 w-5" />
          <span>New</span>
        </Link>

        <Link
          to="/"
          className="flex flex-col items-center gap-1 py-1 text-[11px] font-medium text-muted-foreground transition hover:text-foreground"
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
      </nav>
    </div>
  )
}
