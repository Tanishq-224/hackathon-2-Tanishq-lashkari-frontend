import { Link } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button'
import {
  getProfileInitials,
  useAuthSession,
} from '@/hooks/useAuthSession'
import { cn } from '@/lib/utils'

type PublicAccountActionsProps = {
  className?: string
  appearance?: 'default' | 'pill' | 'bar' | 'primary'
}

/**
 * @description Navbar account controls: log in when logged out, avatar when logged in.
 * @param {PublicAccountActionsProps} props - Optional wrapper class names and visual variant.
 * @returns {JSX.Element} Auth actions for the public header.
 */
export function PublicAccountActions({
  className,
  appearance = 'default',
}: PublicAccountActionsProps) {
  const { isAuthenticated, user, isLoading } = useAuthSession()

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
      <Link
        to="/dashboard"
        className={cn(
          'flex size-9 items-center justify-center rounded-full border border-white/20 bg-primary text-ui font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90',
          className,
        )}
        aria-label={`${user.fullName} account menu`}
        title={user.fullName}
      >
        {initials}
      </Link>
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
