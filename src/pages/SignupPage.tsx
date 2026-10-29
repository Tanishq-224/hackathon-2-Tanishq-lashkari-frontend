import { Link } from 'react-router-dom'

import { Container } from '@/components/shared/Container'
import { buttonVariants } from '@/components/ui/button'

/**
 * @description Sign-up route placeholder until Phase 2 authentication ships.
 * @returns {JSX.Element} Sign-up page shell inside AuthLayout.
 */
export function SignupPage() {
  return (
    <Container className="flex flex-1 flex-col justify-center py-12 max-w-md">
      <h1 className="font-display text-h1 font-bold text-foreground">Sign up</h1>
      <p className="mt-3 text-body text-muted-foreground">
        Customer and vendor registration with email verification arrives in Phase
        2. Use Log in once the session API is live.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/login" className={buttonVariants({ className: 'rounded-full' })}>
          Log in instead
        </Link>
        <Link
          to="/"
          className={buttonVariants({ variant: 'outline', className: 'rounded-full' })}
        >
          Back to home
        </Link>
      </div>
    </Container>
  )
}
