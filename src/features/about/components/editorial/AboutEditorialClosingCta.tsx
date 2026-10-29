import { Link } from 'react-router-dom'

import aboutClosingBg from '@/assets/cta-factory-background.jpg'
import { AboutEditorialShell } from '@/features/about/components/editorial/AboutEditorialShell'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * @description Warm closing CTA band for the About page (matches home accent sections).
 * @returns {JSX.Element} Final get-started section.
 */
export function AboutEditorialClosingCta() {
  return (
    <section
      aria-label="Get started with Repairex"
      className="px-4 py-8 pb-12 sm:px-6 lg:px-8"
    >
      <AboutEditorialShell className="relative min-h-[20rem] overflow-hidden">
        <img
          src={aboutClosingBg}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-55"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-background/95 via-background/80 to-background/55"
          aria-hidden
        />

        <div className="relative z-10 flex min-h-[20rem] flex-col items-center justify-center px-6 py-14 text-center sm:px-10">
          <h2 className="max-w-2xl font-display text-[clamp(1.75rem,4.5vw,3rem)] leading-tight font-bold tracking-tight text-foreground">
            Transparent repairs, structured for customers and vendors
          </h2>
          <p className="mt-4 max-w-lg text-body-lg text-muted-foreground">
            Ready when you are — start a request or explore the home walkthrough.
          </p>
          <Link
            to="/contact"
            className={cn(
              buttonVariants({
                size: 'lg',
                className: 'mt-8 h-11 rounded-full px-8',
              }),
            )}
          >
            Start today
          </Link>
        </div>
      </AboutEditorialShell>
    </section>
  )
}
