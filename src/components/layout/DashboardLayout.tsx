import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, PlusCircle, Store, UserCircle, Wrench, type LucideIcon } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

import { DashboardWorkspaceHeader } from '@/components/layout/DashboardWorkspaceHeader'
import type { DashboardNavItem } from '@/components/layout/DashboardMobileNavMenu'
import { DashboardScrollReveal } from '@/components/shared/DashboardScrollReveal'
import { logoutRequest } from '@/features/auth/api/authApi'
import { authSessionQueryKey, useAuthSession } from '@/hooks/useAuthSession'
import { cn } from '@/lib/utils'

type DashboardBottomNavTabProps = {
  to: string
  label: string
  icon: LucideIcon
  active: boolean
}

/**
 * @description Mobile bottom tab with primary pill active state (matches public mobile nav links).
 */
function DashboardBottomNavTab({ to, label, icon: Icon, active }: DashboardBottomNavTabProps) {
  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[11px] font-medium transition-all duration-200',
        active
          ? 'bg-primary font-semibold text-primary-foreground shadow-[0_8px_24px_-8px] shadow-primary/50 ring-2 ring-primary/35'
          : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
      )}
    >
      <Icon aria-hidden className="size-5 shrink-0" strokeWidth={active ? 2.25 : 2} />
      <span className="max-w-full truncate">{label}</span>
    </Link>
  )
}

/**
 * @description Dedicated Dashboard Layout with a full-width dedicated workspace header, desktop sidebar, and mobile nav.
 * @returns {JSX.Element}
 */
export function DashboardLayout() {
  const { isAuthenticated, user, isLoading } = useAuthSession()
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

  const navItems: DashboardNavItem[] = isVendor
    ? [
        {
          label: 'Marketplace Feed',
          to: '/dashboard/marketplace',
          icon: Store,
        },
        {
          label: 'My Active Repairs',
          to: '/dashboard',
          icon: Wrench,
          end: true,
        },
        {
          label: 'My Profile',
          to: '/dashboard/profile',
          icon: UserCircle,
          end: true,
        },
      ]
    : [
        {
          label: 'My Repairs',
          to: '/dashboard',
          icon: Wrench,
          end: true,
        },
        {
          label: 'New Request',
          to: '/dashboard/new-repair',
          icon: PlusCircle,
          end: true,
        },
        {
          label: 'My Profile',
          to: '/dashboard/profile',
          icon: UserCircle,
          end: true,
        },
      ]

  function isNavItemActive(item: DashboardNavItem): boolean {
    if (item.to === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    if (item.to === '/dashboard/marketplace') {
      return location.pathname.startsWith('/dashboard/marketplace')
    }
    return location.pathname === item.to
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <DashboardWorkspaceHeader
        isVendor={isVendor}
        navItems={navItems}
        userFullName={user?.fullName}
        userEmail={user?.email}
        onLogout={() => {
          void handleLogout()
        }}
      />

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
                const active = isNavItemActive(item)
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-ui font-medium transition',
                      active
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground',
                    )}
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
        <main className="dashboard-main flex-1 overflow-x-hidden p-3 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] sm:p-4 md:p-8 md:pb-12 lg:pb-8">
          <DashboardScrollReveal>
            <Outlet />
          </DashboardScrollReveal>
        </main>
      </div>

      {/* Mobile / Tablet Bottom Navigation Bar (<1024px) */}
      <nav
        className="dashboard-bottom-nav theme-bottom-nav fixed bottom-0 left-0 right-0 z-40 flex h-[4.25rem] items-center gap-1 border-t border-border px-2 pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
        aria-label="Mobile Navigation"
      >
        {isVendor ? (
          <>
            <DashboardBottomNavTab
              to="/dashboard/marketplace"
              label="Marketplace"
              icon={Store}
              active={location.pathname.startsWith('/dashboard/marketplace')}
            />
            <DashboardBottomNavTab
              to="/dashboard"
              label="Active"
              icon={Wrench}
              active={
                location.pathname === '/dashboard' ||
                location.pathname.startsWith('/dashboard/repairs')
              }
            />
            <DashboardBottomNavTab
              to="/dashboard/profile"
              label="Profile"
              icon={UserCircle}
              active={location.pathname === '/dashboard/profile'}
            />
          </>
        ) : (
          <>
            <DashboardBottomNavTab
              to="/dashboard"
              label="Repairs"
              icon={Wrench}
              active={
                location.pathname === '/dashboard' ||
                location.pathname.startsWith('/dashboard/repairs')
              }
            />
            <DashboardBottomNavTab
              to="/dashboard/new-repair"
              label="New"
              icon={PlusCircle}
              active={location.pathname === '/dashboard/new-repair'}
            />
            <DashboardBottomNavTab
              to="/dashboard/profile"
              label="Profile"
              icon={UserCircle}
              active={location.pathname === '/dashboard/profile'}
            />
          </>
        )}
      </nav>
    </div>
  )
}
