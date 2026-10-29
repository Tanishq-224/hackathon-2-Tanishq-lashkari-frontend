import { Link } from 'react-router-dom'

import { Container } from '@/components/shared/Container'
import { ScrollFadeIn } from '@/components/shared/ScrollFadeIn'
import { buttonVariants } from '@/components/ui/button'

/**
 * @description Fallback route for unknown URLs.
 * @returns {JSX.Element} 404 page with link back home.
 */
export function NotFoundPage() {
  return (
    <main className="flex flex-1 flex-col justify-center py-16">
      <Container className="text-center">
        <ScrollFadeIn>
          <h1 className="text-h1 font-bold text-foreground">Page not found</h1>
          <p className="mt-3 text-body text-slate-grey">
            The page you requested does not exist or has moved.
          </p>
          <Link
            to="/"
            className={buttonVariants({ size: 'lg', className: 'mt-6' })}
          >
            Back to home
          </Link>
        </ScrollFadeIn>
      </Container>
    </main>
  )
}
