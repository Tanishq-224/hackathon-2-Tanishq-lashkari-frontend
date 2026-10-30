import { Link } from 'react-router-dom'
import { Home, LogOut, User } from 'lucide-react'

import { DashboardMobileNavMenu, type DashboardNavItem } from '@/components/layout/DashboardMobileNavMenu'
import { DashboardNotificationsBell } from '@/components/layout/DashboardNotificationsBell'
import { RepairexBrandMark } from '@/components/layout/RepairexBrandMark'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { Button } from '@/components/ui/button'
import { getProfileInitials } from '@/hooks/useAuthSession'

type DashboardWorkspaceHeaderProps = {
  isVendor: boolean
  navItems: DashboardNavItem[]
  userFullName?: string
  userEmail?: string
  onLogout: () => void
}

/**
 * @description Full-width dashboard workspace header — compact actions on mobile, full bar on desktop.
 */
export function DashboardWorkspaceHeader({
  isVendor,
  navItems,
  userFullName,
  userEmail,
  onLogout,
}: DashboardWorkspaceHeaderProps) {
  const roleShort = isVendor ? 'Vendor' : 'Customer'
  const roleLong = isVendor ? 'Vendor Portal' : 'Customer Workspace'

  return (
    <header className="sticky top-0 z-40 flex min-h-16 w-full shrink-0 items-center justify-between gap-2 border-b border-border bg-card/95 px-3 py-2 backdrop-blur-md sm:gap-3 sm:px-4 md:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4 md:gap-6">
          <Link
            to="/"
            className="flex min-w-0 shrink-0 items-center gap-2 transition-opacity hover:opacity-90 sm:gap-2.5"
            aria-label="Repairex Home"
          >
            <RepairexBrandMark className="size-8 shrink-0 sm:size-9" />
            <span className="font-display truncate text-base font-bold tracking-tight text-foreground sm:text-lg">
              Repairex
            </span>
          </Link>
          <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary sm:hidden">
            {roleShort}
          </span>
          <span className="hidden shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-caption font-semibold uppercase tracking-wider text-primary sm:inline">
            {roleLong}
          </span>
      </div>

      <div className="hidden shrink-0 items-center gap-2 lg:flex lg:gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-caption font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <Home className="size-3.5" />
            <span>Public Site</span>
          </Link>

          <DashboardNotificationsBell />

          <ThemeToggle className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/50 text-foreground hover:bg-secondary" />

          <Link
            to="/dashboard/profile"
            className="flex max-w-[12rem] items-center gap-2.5 rounded-xl border border-border bg-secondary/40 px-3 py-1.5 transition hover:border-primary/40 hover:bg-secondary/70"
          >
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              {userFullName ? getProfileInitials(userFullName) : <User className="size-3.5" />}
            </div>
            <div className="min-w-0 text-left">
              <p className="truncate text-caption font-semibold leading-none text-foreground">
                {userFullName}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">{userEmail}</p>
            </div>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onLogout()
            }}
            className="flex items-center gap-1.5 text-ui font-medium"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </Button>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:hidden">
          <DashboardNotificationsBell />
          <ThemeToggle className="flex size-9 items-center justify-center rounded-lg border border-border bg-secondary/50 text-foreground hover:bg-secondary" />
          <DashboardMobileNavMenu
            navItems={navItems}
            roleLabel={roleLong}
            userFullName={userFullName}
            userEmail={userEmail}
            onLogout={onLogout}
          />
      </div>
    </header>
  )
}
