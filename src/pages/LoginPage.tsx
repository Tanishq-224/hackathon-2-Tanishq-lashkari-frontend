import { Link } from 'react-router-dom'

import { Container } from '@/components/shared/Container'
import { ScrollFadeIn } from '@/components/shared/ScrollFadeIn'
import { buttonVariants } from '@/components/ui/button'

/**
 * @description Login route placeholder until Phase 2 authentication ships.
 * @returns {JSX.Element} Login page shell.
 */
export function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col justify-center bg-background py-12">
      <Container className="max-w-md">
        <ScrollFadeIn>
          <h1 className="text-h1 font-bold text-foreground">Log in</h1>
          <p className="mt-3 text-body text-muted-foreground">
            Email, password, and OAuth login will connect to the backend in
            Phase 2. The public navbar already links here so we can swap in the
            real form without changing routes.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/" className={buttonVariants({ variant: 'outline' })}>
              Back to home
            </Link>
            <Link to="/signup" className={buttonVariants()}>
              Create account
            </Link>
          </div>
        </ScrollFadeIn>
      </Container>
    </main>
  )
}
