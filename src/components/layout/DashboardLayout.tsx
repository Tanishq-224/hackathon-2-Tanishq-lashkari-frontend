import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Home,
  LogOut,
  Moon,
  PlusCircle,
  Store,
  Sun,
  User,
  Wrench,
} from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

import { RepairexBrandMark } from './RepairexBrandMark'
import { Button } from '@/components/ui/button'
import { logoutRequest } from '@/features/auth/api/authApi'
import {
  authSessionQueryKey,
  getProfileInitials,
  useAuthSession,
} from '@/hooks/useAuthSession'
import { useTheme } from '@/providers/ThemeProvider'

/**
 * @description Dedicated Dashboard Layout with a full-width dedicated workspace header, desktop sidebar, and mobile nav.
 * @returns {JSX.Element}
 */
export function DashboardLayout() {
  const { isAuthenticated, user, isLoading } = useAuthSession()
  const { resolvedTheme, toggleTheme } = useTheme()
  const queryClient = useQueryClient()
  const location = useLocation()
  const navigate = useNavigate()

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

  async function handleLogout() {
    try {
      await logoutRequest()
    } catch {
      // Best-effort logout
    } finally {
      await queryClient.invalidateQueries({ queryKey: authSessionQueryKey })
      navigate('/login')
    }
  }

  const isVendor = user?.role === 'vendor'

  const navItems = isVendor
    ? [
        {
          label: 'Marketplace Feed',
          to: '/dashboard/marketplace',
          icon: Store,
          active: location.pathname === '/dashboard/marketplace',
        },
        {
          label: 'My Active Repairs',
          to: '/dashboard',
          icon: Wrench,
          active: location.pathname === '/dashboard',
        },
      ]
    : [
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
      {/* Dedicated Dashboard Workspace Header */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-md md:px-8">
        {/* Brand & Workspace Mode */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 transition hover:opacity-90"
            aria-label="Repairex Home"
          >
            <RepairexBrandMark className="size-8 sm:size-9" />
            <span className="font-display text-lg font-bold tracking-tight text-foreground sm:inline-block">
              Repairex
            </span>
          </Link>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-caption font-semibold uppercase tracking-wider text-primary">
            {isVendor ? 'Vendor Portal' : 'Customer Workspace'}
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-caption font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground sm:flex"
          >
            <Home className="size-3.5" />
            <span>Public Site</span>
          </Link>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/50 text-foreground transition hover:bg-secondary"
            aria-label="Toggle color theme"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 rounded-xl border border-border bg-secondary/40 px-3 py-1.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              {user ? getProfileInitials(user.fullName) : <User className="size-3.5" />}
            </div>
            <div className="hidden text-left sm:block">
              <p className="max-w-[130px] truncate text-caption font-semibold leading-none text-foreground">
                {user?.fullName}
              </p>
              <p className="max-w-[130px] truncate text-[11px] text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void handleLogout()
            }}
            className="flex items-center gap-1.5 text-ui font-medium"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1">
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
        {isVendor ? (
          <>
            <Link
              to="/dashboard/marketplace"
              className={`flex flex-col items-center gap-1 py-1 text-[11px] font-medium transition ${
                location.pathname === '/dashboard/marketplace'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Store className="h-5 w-5" />
              <span>Marketplace</span>
            </Link>

            <Link
              to="/dashboard"
              className={`flex flex-col items-center gap-1 py-1 text-[11px] font-medium transition ${
                location.pathname === '/dashboard'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Wrench className="h-5 w-5" />
              <span>Active</span>
            </Link>
          </>
        ) : (
          <>
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
          </>
        )}

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
