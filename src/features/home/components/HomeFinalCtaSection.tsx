import { Link } from 'react-router-dom'

import ctaFactoryBackground from '@/assets/cta-factory-background.jpg'
import { Container } from '@/components/shared/Container'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * @description Full-bleed closing CTA with factory imagery and frosted content layer.
 * @returns {JSX.Element} Final CTA section (footer follows in layout).
 */
export function HomeFinalCtaSection() {
  return (
    <section
      id="get-started"
      aria-label="Get started with Repairex"
      className="home-cta-viewport relative isolate overflow-hidden"
    >
      <div className="absolute inset-0 z-0" aria-hidden>
        <img
          src={ctaFactoryBackground}
          alt=""
          className="size-full scale-105 object-cover object-center blur-[2px]"
          width={1920}
          height={1080}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#0f1115]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10]/55 via-[#0f1115]/15 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c10]/25 via-transparent to-[#0a0c10]/20" />
      </div>

      <div className="relative z-10 border-y border-white/15 bg-black/10 py-14 backdrop-blur-sm sm:py-16 lg:py-20">
        <Container className="text-center">
          <h2 className="font-display text-h1 font-bold tracking-tight text-white drop-shadow-md">
            Ready to start your repair request?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-body-lg leading-relaxed text-white/90 drop-shadow-sm">
            Tell us about your device and issue. Compare vendor estimates, approve
            the final quote, and stay updated until the repair is complete.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/contact"
              className={cn(
                buttonVariants({
                  size: 'lg',
                  className: 'h-11 w-full rounded-full px-7 sm:w-auto',
                }),
              )}
            >
              Start a repair request
            </Link>
            <Link
              to="/about"
              className={cn(
                buttonVariants({
                  variant: 'outline',
                  size: 'lg',
                  className:
                    'h-11 w-full rounded-full border-white/35 bg-black/25 px-7 text-white hover:bg-black/35 hover:text-white sm:w-auto',
                }),
              )}
            >
              Learn about Repairex
            </Link>
          </div>
        </Container>
      </div>
    </section>
  )
}
