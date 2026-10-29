import type { ReactNode } from 'react'

import heroBackground from '@/assets/hero-background.jpg'
import { Container } from '@/components/shared/Container'
import { ScrollFadeIn } from '@/components/shared/ScrollFadeIn'
import { cn } from '@/lib/utils'

type MarketingPageHeroProps = {
  ariaLabel: string
  eyebrow: string
  title: ReactNode
  description: ReactNode
  className?: string
}

/**
 * @description Compact marketing hero for public inner pages (about, contact).
 * @param {MarketingPageHeroProps} props - Hero copy and accessibility label.
 * @returns {JSX.Element} Blurred imagery hero block.
 */
export function MarketingPageHero({
  ariaLabel,
  eyebrow,
  title,
  description,
  className,
}: MarketingPageHeroProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={cn(
        'relative isolate overflow-hidden border-b border-border',
        className,
      )}
    >
      <div className="absolute inset-0 z-0" aria-hidden>
        <img
          src={heroBackground}
          alt=""
          className="size-full scale-105 object-cover object-center blur-[6px]"
          width={1920}
          height={1080}
          loading="eager"
        />
        <div className="absolute inset-0 bg-[#0f1115]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10]/80 via-[#0f1115]/35 to-[#0f1115]/20" />
      </div>

      <Container className="relative z-10 py-24 pt-28 sm:py-28 sm:pt-32 lg:py-32">
        <ScrollFadeIn className="mx-auto max-w-3xl text-center" distance={28}>
          <p className="text-ui font-semibold tracking-[0.18em] text-primary uppercase">
            {eyebrow}
          </p>
          <h1 className="text-h1 mt-4 font-bold tracking-tight text-white drop-shadow-md sm:text-hero">
            {title}
          </h1>
          <p className="mt-5 text-body-lg leading-relaxed text-white/90 drop-shadow-sm">
            {description}
          </p>
        </ScrollFadeIn>
      </Container>
    </section>
  )
}
