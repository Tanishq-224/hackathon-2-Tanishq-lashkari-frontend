import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Container } from '@/components/shared/Container'
import { ScrollFadeIn } from '@/components/shared/ScrollFadeIn'
import { TypewriterText } from '@/components/shared/TypewriterText'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import heroBackground from '@/assets/hero-background.jpg'

/**
 * @description Full viewport home hero with blurred background imagery and sharp foreground copy.
 * @returns {JSX.Element} Hero section markup.
 */
export function HomeHeroSection() {
  return (
    <section
      aria-label="Hero"
      className="home-hero-viewport relative isolate z-[var(--z-hero)] overflow-hidden border-b border-border"
    >
      <div className="absolute inset-0 z-0" aria-hidden>
        <img
          src={heroBackground}
          alt=""
          className="size-full scale-105 object-cover object-center blur-[5px]"
          width={1920}
          height={1080}
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-[#0f1115]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10]/75 via-[#0f1115]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c10]/55 via-transparent to-transparent" />
      </div>

      <Container className="relative z-[var(--z-hero-content)] flex min-h-[inherit] flex-col justify-end pb-10 pt-20 sm:pb-12 sm:pt-24 lg:pb-16">
        <ScrollFadeIn
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_min(340px,32vw)] lg:items-end lg:gap-10"
          distance={22}
          duration={0.5}
          delay={0}
          stagger={0.08}
          threshold={0.02}
          scrollTriggerStart="top top+=80"
          ease="power2.out"
        >
          <p className="max-w-3xl text-ui font-semibold tracking-[0.18em] text-primary uppercase lg:col-start-1">
            Smart electronics repair marketplace
          </p>

          <h1 className="max-w-3xl text-hero font-bold text-white drop-shadow-md lg:col-start-1">
            <span className="block text-balance">
              Compare repair options with
            </span>
            <span className="mt-1 block text-primary">
              <TypewriterText
                phrases={[
                  'clear estimates',
                  'transparent quotes',
                  'tracked repairs',
                  'informed approval',
                ]}
                holdMs={1400}
                typingMs={32}
              />
            </span>
          </h1>

          <p className="max-w-2xl text-body-lg text-white/90 drop-shadow-sm lg:col-start-1">
            Submit your device issue, review vendor estimates, approve the
            final quote, and track repair progress — all in one transparent
            workflow.
          </p>

          <div className="flex max-w-3xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:col-start-1">
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
            <a
              href="#how-it-works"
              className={cn(
                buttonVariants({
                  variant: 'outline',
                  size: 'lg',
                  className:
                    'h-11 w-full rounded-full border-white/35 bg-black/25 px-7 text-white hover:bg-black/35 hover:text-white sm:w-auto',
                }),
              )}
            >
              Discover workflow
            </a>
          </div>

          <aside className="border-t border-white/20 pt-8 lg:col-start-2 lg:row-start-1 lg:row-span-4 lg:self-end lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0">
            <p className="flex items-center gap-2 text-caption font-semibold tracking-[0.2em] text-white/80 uppercase drop-shadow-sm">
              <span aria-hidden className="size-2 rounded-sm bg-primary" />
              Workflow spotlight
            </p>
            <p className="mt-3 font-display text-h3 font-semibold leading-snug text-white drop-shadow-md">
              From first request to approved repair — every step stays
              visible.
            </p>
            <p className="mt-2 text-body text-white/85 drop-shadow-sm">
              See how customers compare estimates, pick a vendor, and track
              status without surprise costs.
            </p>
            <Link
              to="/contact"
              className="mt-5 inline-flex items-center gap-2 text-ui font-semibold text-primary drop-shadow-sm transition-colors hover:text-primary/90"
            >
              Get started
              <ArrowUpRight aria-hidden className="size-4" />
            </Link>
          </aside>
        </ScrollFadeIn>
      </Container>
    </section>
  )
}
