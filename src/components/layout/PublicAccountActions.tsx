import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, PlusCircle, Store } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

import { buttonVariants } from '@/components/ui/button'
import { logoutRequest } from '@/features/auth/api/authApi'
import {
  authSessionQueryKey,
  getProfileInitials,
  useAuthSession,
} from '@/hooks/useAuthSession'
import { cn } from '@/lib/utils'

type PublicAccountActionsProps = {
  className?: string
  appearance?: 'default' | 'pill' | 'bar' | 'primary' | 'mobileDrawer'
  /** @description Called after navigation or logout from the mobile drawer variant. */
  onMobileDrawerAction?: () => void
}

/**
 * @description Navbar account controls: log in button when signed out, interactive profile avatar popover when signed in.
 * @param {PublicAccountActionsProps} props - Optional wrapper class names and visual variant.
 * @returns {JSX.Element} Auth actions for headers.
 */
export function PublicAccountActions({
  className,
  appearance = 'default',
  onMobileDrawerAction,
}: PublicAccountActionsProps) {
  const { isAuthenticated, user, isLoading } = useAuthSession()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  async function handleLogout() {
    setOpen(false)
    try {
      await logoutRequest()
    } catch {
      // Best-effort logout cleanup
    } finally {
      await queryClient.invalidateQueries({ queryKey: authSessionQueryKey })
      navigate('/login')
    }
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          appearance === 'mobileDrawer'
            ? 'mx-auto h-32 w-full max-w-xs animate-pulse rounded-2xl bg-muted/60'
            : 'h-8 w-20 animate-pulse rounded-full bg-white/10',
          className,
        )}
        aria-hidden
      />
    )
  }

  if (isAuthenticated && user) {
    const initials = getProfileInitials(user.fullName)
    const designation =
      user.role === 'vendor' ? 'Verified Vendor' : 'Customer Account'

    if (appearance === 'mobileDrawer') {
      return (
        <div className={cn('flex w-full flex-col items-center text-center', className)}>
          <div className="flex size-16 items-center justify-center rounded-full border-2 border-primary/30 bg-primary text-h3 font-bold text-primary-foreground shadow-md">
            {initials}
          </div>
          <p className="mt-3 max-w-full truncate font-display text-h3 font-semibold text-foreground">
            {user.fullName}
          </p>
          <p className="mt-1 text-ui font-medium text-primary">{designation}</p>
          <p className="mt-1 max-w-full truncate text-caption text-muted-foreground">
            {user.email}
          </p>
          <div className="mt-5 flex w-full max-w-xs flex-col gap-2">
            <Link
              to="/dashboard"
              onClick={() => onMobileDrawerAction?.()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-ui font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <LayoutDashboard className="size-4" aria-hidden />
              Dashboard
            </Link>
            <button
              type="button"
              onClick={() => {
                onMobileDrawerAction?.()
                void handleLogout()
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/35 px-4 py-3 text-ui font-semibold text-destructive transition hover:bg-destructive/10"
            >
              <LogOut className="size-4" aria-hidden />
              Log out
            </button>
          </div>
        </div>
      )
    }

    return (
      <div ref={menuRef} className="relative inline-block text-left">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            'flex size-9 items-center justify-center rounded-full border border-white/20 bg-primary text-ui font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            className,
          )}
          aria-label={`${user.fullName} account menu`}
          aria-expanded={open}
          aria-haspopup="true"
          title={user.fullName}
        >
          {initials}
        </button>

        {open && (
          <div
            className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-2xl ring-1 ring-black/5 z-50 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
            role="menu"
            aria-orientation="vertical"
          >
            {/* User Profile Card Header */}
            <div className="flex items-start gap-3 border-b border-border/80 pb-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-ui font-bold text-primary">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-ui font-semibold text-foreground">
                  {user.fullName}
                </p>
                <p className="truncate text-caption text-muted-foreground">
                  {user.email}
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium capitalize text-secondary-foreground">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {user.role === 'vendor' ? 'Verified Vendor' : 'Customer Account'}
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <div className="mt-2 space-y-1">
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-ui font-medium text-foreground transition hover:bg-secondary"
                role="menuitem"
              >
                <LayoutDashboard className="size-4 text-muted-foreground" />
                <span>Dashboard</span>
              </Link>
              {user.role === 'vendor' ? (
                <Link
                  to="/dashboard/marketplace"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-ui font-medium text-foreground transition hover:bg-secondary"
                  role="menuitem"
                >
                  <Store className="size-4 text-muted-foreground" />
                  <span>Vendor Marketplace</span>
                </Link>
              ) : (
                <Link
                  to="/dashboard/new-repair"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-ui font-medium text-foreground transition hover:bg-secondary"
                  role="menuitem"
                >
                  <PlusCircle className="size-4 text-muted-foreground" />
                  <span>New Repair Request</span>
                </Link>
              )}
            </div>

            {/* Logout button */}
            <div className="mt-2 border-t border-border/80 pt-2">
              <button
                type="button"
                onClick={() => {
                  void handleLogout()
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-ui font-medium text-destructive transition hover:bg-destructive/10"
                role="menuitem"
              >
                <LogOut className="size-4" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (appearance === 'pill') {
    return (
      <Link
        to="/login"
        className={cn(
          'inline-flex h-9 items-center justify-center rounded-full bg-white px-4 text-ui font-semibold text-[#141414] transition hover:bg-white/90',
          className,
        )}
      >
        Log in
      </Link>
    )
  }

  if (appearance === 'bar') {
    return (
      <Link
        to="/login"
        className={cn(
          'inline-flex h-10 items-center justify-center rounded-full bg-[#141414] px-5 text-ui font-semibold text-white shadow-sm transition hover:bg-[#141414]/90',
          className,
        )}
      >
        Log in
      </Link>
    )
  }

  if (appearance === 'primary') {
    return (
      <Link
        to="/login"
        className={cn(
          'inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-ui font-semibold text-primary-foreground shadow-[0_4px_14px_-4px] shadow-primary/50 transition duration-300 hover:bg-primary/90 active:scale-[0.98]',
          className,
        )}
      >
        Log in
      </Link>
    )
  }

  if (appearance === 'mobileDrawer') {
    return (
      <div className={cn('flex w-full flex-col items-center gap-2', className)}>
        <Link
          to="/login"
          onClick={() => onMobileDrawerAction?.()}
          className="inline-flex h-11 w-full max-w-xs items-center justify-center rounded-xl bg-primary px-5 text-ui font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90"
        >
          Log in
        </Link>
        <Link
          to="/signup"
          onClick={() => onMobileDrawerAction?.()}
          className="inline-flex h-11 w-full max-w-xs items-center justify-center rounded-xl border border-border px-5 text-ui font-semibold text-foreground transition hover:bg-muted"
        >
          Sign up
        </Link>
      </div>
    )
  }

  return (
    <Link
      to="/login"
      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), className)}
    >
      Log in
    </Link>
  )
}
