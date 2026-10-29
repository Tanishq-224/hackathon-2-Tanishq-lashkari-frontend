import { Link } from 'react-router-dom'

import aboutClosingBg from '@/assets/cta-factory-background.jpg'
import { AboutEditorialShell } from '@/features/about/components/editorial/AboutEditorialShell'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * @description Dark closing CTA band for the About page.
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
          className="absolute inset-0 size-full object-cover opacity-50"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[#0c0d10]/75" aria-hidden />

        <div className="relative z-10 flex min-h-[20rem] flex-col items-center justify-center px-6 py-14 text-center sm:px-10">
          <h2 className="max-w-2xl font-display text-[clamp(1.75rem,4.5vw,3rem)] leading-tight font-bold tracking-tight text-white">
            Transparent repairs, structured for customers and vendors
          </h2>
          <p className="mt-4 max-w-lg text-body-lg text-white/75">
            From first estimate to pickup confirmation — one dashboard, email updates,
            and proof-backed completion for every ticket.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/signup"
              className={cn(
                buttonVariants({
                  size: 'lg',
                  className: 'h-11 rounded-full px-8',
                }),
              )}
            >
              Create account
            </Link>
            <Link
              to="/contact"
              className={cn(
                buttonVariants({
                  variant: 'outline',
                  size: 'lg',
                  className:
                    'h-11 rounded-full border-white/30 bg-white/5 px-8 text-white hover:bg-white/10 hover:text-white',
                }),
              )}
            >
              Talk to us
            </Link>
          </div>
        </div>
      </AboutEditorialShell>
    </section>
  )
}
