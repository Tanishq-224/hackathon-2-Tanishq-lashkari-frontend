import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, PlusCircle } from 'lucide-react'
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
  appearance?: 'default' | 'pill' | 'bar' | 'primary'
}

/**
 * @description Navbar account controls: log in button when signed out, interactive profile avatar popover when signed in.
 * @param {PublicAccountActionsProps} props - Optional wrapper class names and visual variant.
 * @returns {JSX.Element} Auth actions for headers.
 */
export function PublicAccountActions({
  className,
  appearance = 'default',
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
        className={cn('h-8 w-20 animate-pulse rounded-full bg-white/10', className)}
        aria-hidden
      />
    )
  }

  if (isAuthenticated && user) {
    const initials = getProfileInitials(user.fullName)

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
              <Link
                to="/dashboard/new-repair"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-ui font-medium text-foreground transition hover:bg-secondary"
                role="menuitem"
              >
                <PlusCircle className="size-4 text-muted-foreground" />
                <span>New Repair Request</span>
              </Link>
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

  return (
    <Link
      to="/login"
      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), className)}
    >
      Log in
    </Link>
  )
}
