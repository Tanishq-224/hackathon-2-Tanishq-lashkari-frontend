import { Link } from 'react-router-dom'

import { PageSection } from '@/components/shared/PageSection'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * @description Closing get-started CTA for the Contact page (brief section 5).
 * @returns {JSX.Element} Final CTA band before shared footer.
 */
export function ContactFinalCtaSection() {
  return (
    <PageSection tone="accent" ariaLabel="Start a repair request">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-h1 font-bold tracking-tight text-foreground">
          Ready to start a repair request?
        </h2>
        <p className="mt-4 text-body-lg text-muted-foreground">
          Walk through device categories and the workflow on the home page, then
          reach out when you are ready to compare vendor estimates.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/#get-started"
            className={cn(
              buttonVariants({
                size: 'lg',
                className: 'h-11 w-full rounded-full px-7 sm:w-auto',
              }),
            )}
          >
            Get started on home
          </Link>
          <Link
            to="/about"
            className={cn(
              buttonVariants({
                variant: 'outline',
                size: 'lg',
                className: 'h-11 w-full rounded-full px-7 sm:w-auto',
              }),
            )}
          >
            About Repairex
          </Link>
        </div>
      </div>
    </PageSection>
  )
}
