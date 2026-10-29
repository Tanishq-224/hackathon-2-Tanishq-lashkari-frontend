import { ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import deviceLaptopWork from '@/assets/devices/device-laptop-work.png'
import deviceLifestyle from '@/assets/devices/device-lifestyle.jpg'
import devicePhone from '@/assets/devices/device-phone.jpg'
import { Container } from '@/components/shared/Container'
import { ScrollFadeIn } from '@/components/shared/ScrollFadeIn'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { SectionSurface } from '@/components/shared/SectionSurface'
import { useGsapHorizontalScroll } from '@/hooks/useGsapHorizontalScroll'
import { cn } from '@/lib/utils'

type WhyCard =
  | {
      key: string
      kind: 'stat'
      eyebrow: string
      headline: string
      title: string
      description: string
    }
  | {
      key: string
      kind: 'visual'
      title: string
      description: string
      imageSrc: string
      imageAlt: string
      wide?: boolean
    }

const whyCards: WhyCard[] = [
  {
    key: 'upfront',
    kind: 'stat',
    eyebrow: '01',
    headline: 'Upfront estimates',
    title: 'Transparent pricing',
    description:
      'See preliminary vendor estimates before you commit to a repair path or hand over your device.',
  },
  {
    key: 'compare',
    kind: 'visual',
    title: 'Compare options with confidence',
    description:
      'Review eligible vendor estimates side by side so scope, timing, and cost stay visible from the start.',
    imageSrc: devicePhone,
    imageAlt: 'Customer comparing repair estimates on a phone',
    wide: true,
  },
  {
    key: 'approval',
    kind: 'visual',
    title: 'Informed approval',
    description:
      'Diagnosis reports and itemized final quotes keep you in control before work begins.',
    imageSrc: deviceLifestyle,
    imageAlt: 'Technician inspecting electronics in a workshop',
  },
  {
    key: 'accountability',
    kind: 'stat',
    eyebrow: '04',
    headline: 'Tracked status',
    title: 'Accountability built in',
    description:
      'Role-based access and status history protect customers and vendors through every repair stage.',
  },
  {
    key: 'workflow',
    kind: 'visual',
    title: 'Structured workflow',
    description:
      'Requests, vendor selection, quotation approval, and updates follow clear rules — not ad-hoc messages.',
    imageSrc: deviceLaptopWork,
    imageAlt: 'Laptop ready for structured repair workflow',
    wide: true,
  },
]

type WhyStatCardProps = {
  card: Extract<WhyCard, { kind: 'stat' }>
}

/**
 * @description Dark textured stat card for the Why Repairex cinematic rail.
 * @param {WhyStatCardProps} props - Card content.
 * @returns {JSX.Element} Stat card.
 */
function WhyStatCard({ card }: WhyStatCardProps) {
  return (
    <article className="why-cinematic-stat flex h-[min(68vh,25rem)] w-[min(78vw,19rem)] shrink-0 flex-col justify-between rounded-[var(--card-marketing-radius)] p-6 text-white sm:w-[22rem]">
      <div>
        <span className="text-caption font-medium text-white/55">{card.eyebrow}</span>
        <p className="font-display mt-4 text-[clamp(1.5rem,3.2vw,2rem)] font-bold leading-tight tracking-tight">
          {card.headline}
        </p>
      </div>
      <div>
        <h3 className="font-display text-h3 font-semibold">{card.title}</h3>
        <p className="mt-2 text-ui leading-relaxed text-white/70">{card.description}</p>
      </div>
    </article>
  )
}

type WhyVisualCardProps = {
  card: Extract<WhyCard, { kind: 'visual' }>
}

/**
 * @description Image-forward card with caption footer for the cinematic rail.
 * @param {WhyVisualCardProps} props - Card content and imagery.
 * @returns {JSX.Element} Visual card.
 */
function WhyVisualCard({ card }: WhyVisualCardProps) {
  return (
    <article
      className={cn(
        'theme-marketing-card flex h-[min(68vh,25rem)] w-[min(78vw,20rem)] shrink-0 flex-col overflow-hidden p-0 sm:w-[24rem]',
        card.wide && 'sm:w-[min(88vw,34rem)]',
      )}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden bg-muted">
        <img
          src={card.imageSrc}
          alt={card.imageAlt}
          className="why-cinematic-image size-full object-cover object-center"
          loading="lazy"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10"
        />
      </div>
      <div className="border-t border-border/80 p-5 sm:p-6">
        <h3 className="font-display text-h3 font-semibold text-foreground">{card.title}</h3>
        <p className="mt-2 text-ui leading-relaxed text-muted-foreground">
          {card.description}
        </p>
      </div>
    </article>
  )
}

type WhyCaptionProps = {
  title: string
  description: string
}

/**
 * @description Reference-style caption row under the horizontal card rail.
 * @param {WhyCaptionProps} props - Active card title and description.
 * @returns {JSX.Element} Caption block.
 */
function WhyCaption({ title, description }: WhyCaptionProps) {
  return (
    <div className="grid gap-4 border-t border-border/80 pt-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] lg:gap-10">
      <h3 className="font-display text-h2 font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="text-body leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}

/**
 * @description Why Repairex horizontal showcase driven by GSAP ScrollTrigger.
 * @returns {JSX.Element} Why choose section.
 */
export function WhyChooseSection() {
  const pinRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [useNativeRail, setUseNativeRail] = useState(false)

  useEffect(() => {
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    const layoutMedia = window.matchMedia('(max-width: 1023px)')

    /**
     * @description Syncs motion preference and mobile layout into React state.
     * @returns {void}
     */
    const sync = () => {
      setUseNativeRail(layoutMedia.matches || motionMedia.matches)
    }
    sync()
    motionMedia.addEventListener('change', sync)
    layoutMedia.addEventListener('change', sync)
    return () => {
      motionMedia.removeEventListener('change', sync)
      layoutMedia.removeEventListener('change', sync)
    }
  }, [])

  /**
   * @description Maps scrub progress to the active highlight card index.
   * @param {number} progress - ScrollTrigger progress between 0 and 1.
   * @returns {void}
   */
  const handleProgress = useCallback((progress: number) => {
    const index = Math.min(
      whyCards.length - 1,
      Math.max(0, Math.round(progress * (whyCards.length - 1))),
    )
    setActiveIndex(index)
  }, [])

  useGsapHorizontalScroll(pinRef, railRef, {
    enabled: !useNativeRail,
    onProgress: handleProgress,
  })

  const activeCard = whyCards[activeIndex] ?? whyCards[0]
  const activeTitle =
    activeCard.kind === 'stat' ? activeCard.headline : activeCard.title
  const activeDescription = activeCard.description

  return (
    <SectionSurface tone="band" ariaLabel="Why choose Repairex" className="!pb-0">
      <Container>
        <ScrollFadeIn delay={0.2} stagger={0.12}>
          <SectionHeader
            eyebrow="Why Repairex"
            title="Built for clarity before you pay"
            description="Repairex is designed for electronics repairs where surprise costs and unclear scope erode trust — compare estimates, approve quotes, and track progress in one workflow."
          />
          <Link
            to="/about"
            className="mt-6 inline-flex items-center gap-2 text-ui font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            View the product
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </ScrollFadeIn>
      </Container>

      {useNativeRail ? (
        <Container className="pb-14 pt-10 sm:pb-16 lg:pb-20">
          <div className="why-cinematic-rail -mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-1 pb-4 sm:gap-6">
            {whyCards.map((card) =>
              card.kind === 'stat' ? (
                <div key={card.key} className="snap-center shrink-0">
                  <WhyStatCard card={card} />
                </div>
              ) : (
                <div key={card.key} className="snap-center shrink-0">
                  <WhyVisualCard card={card} />
                </div>
              ),
            )}
          </div>
          <WhyCaption title={activeTitle} description={activeDescription} />
        </Container>
      ) : (
        <div
          ref={pinRef}
          className="relative mt-8 overflow-hidden sm:mt-10"
          aria-label="Why Repairex highlights"
        >
          <div className="flex min-h-[calc(100dvh-4rem)] flex-col justify-center py-8 sm:py-10">
            <div
              ref={railRef}
              className="why-cinematic-rail flex w-max will-change-transform gap-5 pl-[max(1rem,calc((100vw-min(100vw-2rem,1280px))/2+1rem))] pr-8 sm:gap-6"
            >
              {whyCards.map((card) =>
                card.kind === 'stat' ? (
                  <WhyStatCard key={card.key} card={card} />
                ) : (
                  <WhyVisualCard key={card.key} card={card} />
                ),
              )}
            </div>

            <Container className="mt-8 sm:mt-10">
              <WhyCaption title={activeTitle} description={activeDescription} />
            </Container>
          </div>
        </div>
      )}
    </SectionSurface>
  )
}
