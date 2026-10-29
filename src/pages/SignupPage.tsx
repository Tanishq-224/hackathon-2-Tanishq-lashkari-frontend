import { Link } from 'react-router-dom'

import { Container } from '@/components/shared/Container'
import { ScrollFadeIn } from '@/components/shared/ScrollFadeIn'
import { buttonVariants } from '@/components/ui/button'

/**
 * @description Sign-up route placeholder until Phase 2 authentication ships.
 * @returns {JSX.Element} Sign-up page shell.
 */
export function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col justify-center bg-background py-12">
      <Container className="max-w-md">
        <ScrollFadeIn>
          <h1 className="text-h1 font-bold text-foreground">Sign up</h1>
          <p className="mt-3 text-body text-muted-foreground">
            Customer and vendor registration with email verification arrives in
            Phase 2. Use Log in from the navbar once the session API is live.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/login" className={buttonVariants({ variant: 'outline' })}>
              Log in instead
            </Link>
            <Link to="/" className={buttonVariants()}>
              Back to home
            </Link>
          </div>
        </ScrollFadeIn>
      </Container>
    </main>
  )
}
