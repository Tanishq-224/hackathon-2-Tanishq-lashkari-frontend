import { Link } from 'react-router-dom'

import { Container } from '@/components/shared/Container'
import { buttonVariants } from '@/components/ui/button'

/**
 * @description Login route placeholder until Phase 2 authentication ships.
 * @returns {JSX.Element} Login page shell inside AuthLayout.
 */
export function LoginPage() {
  return (
    <Container className="flex flex-1 flex-col justify-center py-12 max-w-md">
      <h1 className="font-display text-h1 font-bold text-foreground">Log in</h1>
      <p className="mt-3 text-body text-muted-foreground">
        Email, password, and Google sign-in will connect to the backend in Phase
        2. Routes and layout are ready for the real form.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/signup" className={buttonVariants({ className: 'rounded-full' })}>
          Create account
        </Link>
        <Link
          to="/contact"
          className={buttonVariants({ variant: 'outline', className: 'rounded-full' })}
        >
          Contact support
        </Link>
      </div>
    </Container>
  )
}
