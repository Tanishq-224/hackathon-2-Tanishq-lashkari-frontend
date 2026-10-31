import { ArrowRight } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'
import { Link } from 'react-router-dom'

import whyCompareQuotations from '@/assets/devices/why-compare-quotations.jpg'
import whyInformedApproval from '@/assets/devices/why-informed-approval.jpg'
import whyStructuredWorkflow from '@/assets/devices/why-structured-workflow.jpg'
import { Container } from '@/components/shared/Container'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { SectionSurface } from '@/components/shared/SectionSurface'
import { useGsapHorizontalScroll } from '@/hooks/useGsapHorizontalScroll'
import { cn } from '@/lib/utils'

/** @description Viewports below Tailwind `md` use the one-card mobile carousel. */
const WHY_MOBILE_CAROUSEL_MQ = '(max-width: 767px)'

/** @description Auto-advance interval for the mobile Why Repairex carousel. */
const WHY_MOBILE_AUTO_SLIDE_MS = 4500

type WhyLayoutMode = 'mobile-carousel' | 'gsap' | 'reduced-native'

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
      /** @description Mockup fills the media frame edge-to-edge. */
      imageFit?: 'cover' | 'mockup'
      mockupAlign?: 'top' | 'center'
    }

/** @description Shared rail card height so stat + visual tiles align on laptop. */
const whyCardHeightClass =
  'h-[min(64vh,22.5rem)] sm:h-[24rem] lg:h-[24rem]'

/** @description Shared rail card widths (wide tiles use same height). */
function whyCardWidthClass(wide?: boolean) {
  return cn(
    'w-[min(78vw,20rem)] sm:w-[24rem] lg:w-[26rem]',
    wide && 'sm:w-[min(92vw,36rem)] lg:w-[38rem]',
  )
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
    imageSrc: whyCompareQuotations,
    imageAlt: 'Dashboard mockup comparing technician quotations side by side',
    wide: true,
    imageFit: 'mockup',
  },
  {
    key: 'approval',
    kind: 'visual',
    title: 'Informed approval',
    description:
      'Diagnosis reports and itemized final quotes keep you in control before work begins.',
    imageSrc: whyInformedApproval,
    imageAlt: 'How It Works workflow on laptop — submit request through repair completion',
    imageFit: 'mockup',
    mockupAlign: 'center',
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
    imageSrc: whyStructuredWorkflow,
    imageAlt: 'Monitor showing Repairex approval process from quotation review to schedule repair',
    wide: true,
    imageFit: 'mockup',
    mockupAlign: 'center',
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
    <article className="why-cinematic-stat flex h-full w-full flex-col justify-between rounded-[var(--card-marketing-radius)] p-6 text-white">
      <div>
        <span className="text-caption font-medium text-white/55">{card.eyebrow}</span>
        <p className="font-display mt-4 text-[clamp(1.5rem,3.2vw,2rem)] font-bold leading-tight tracking-tight">
          {card.headline}
        </p>
      </div>
      <div>
        <h3 className="font-display text-h3 font-semibold">{card.title}</h3>
        <p className="mt-2 text-ui leading-relaxed text-white/70 line-clamp-4">
          {card.description}
        </p>
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
    <article className="theme-marketing-card flex h-full w-full flex-col overflow-hidden p-0">
      <div className="relative min-h-0 flex-1 overflow-hidden bg-muted">
        <img
          src={card.imageSrc}
          alt={card.imageAlt}
          className={cn(
            'why-cinematic-image absolute inset-0 size-full object-cover',
            card.mockupAlign === 'center' ? 'object-center' : 'object-top',
          )}
          loading="lazy"
        />
        {card.imageFit !== 'mockup' ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10"
          />
        ) : null}
      </div>
      <div className="shrink-0 border-t border-border/80 p-4 sm:p-5">
        <h3 className="font-display text-h3 font-semibold text-foreground line-clamp-2">
          {card.title}
        </h3>
        <p className="mt-1.5 text-ui leading-relaxed text-muted-foreground line-clamp-3">
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
type WhyCaptionElementProps = WhyCaptionProps & {
  titleRef?: RefObject<HTMLHeadingElement | null>
  descriptionRef?: RefObject<HTMLParagraphElement | null>
}

function WhyCaption({
  title,
  description,
  titleRef,
  descriptionRef,
}: WhyCaptionElementProps) {
  return (
    <div className="grid min-h-[7.5rem] gap-4 border-t border-border/80 pt-5 sm:min-h-[7rem] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] lg:min-h-[6.5rem] lg:gap-10 lg:pt-6">
      <h3
        ref={titleRef}
        className="font-display text-h2 font-semibold tracking-tight text-foreground"
      >
        {title}
      </h3>
      <p
        ref={descriptionRef}
        className="text-body leading-relaxed text-muted-foreground"
      >
        {description}
      </p>
    </div>
  )
}

function WhyCardItem({
  card,
  snap,
  mobileSingle,
}: {
  card: WhyCard
  snap?: boolean
  mobileSingle?: boolean
}) {
  const shellClass = cn(
    'flex shrink-0',
    whyCardHeightClass,
    mobileSingle
      ? 'w-full max-w-none'
      : whyCardWidthClass(card.kind === 'visual' ? card.wide : false),
    snap && 'snap-center',
  )

  if (card.kind === 'stat') {
    return (
      <div data-why-card className={shellClass}>
        <WhyStatCard card={card} />
      </div>
    )
  }

  return (
    <div data-why-card className={shellClass}>
      <WhyVisualCard card={card} />
    </div>
  )
}

type WhyMobileCarouselProps = {
  activeIndex: number
  enabled: boolean
  onIndexChange: (index: number) => void
}

/**
 * @description Full-width one-card-at-a-time slider for phones with auto-advance.
 */
function WhyMobileCarousel({
  activeIndex,
  enabled,
  onIndexChange,
}: WhyMobileCarouselProps) {
  useEffect(() => {
    if (!enabled) {
      return undefined
    }

    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionMedia.matches) {
      return undefined
    }

    const timerId = window.setInterval(() => {
      onIndexChange((activeIndex + 1) % whyCards.length)
    }, WHY_MOBILE_AUTO_SLIDE_MS)

    return () => {
      window.clearInterval(timerId)
    }
  }, [activeIndex, enabled, onIndexChange])

  return (
    <div
      className="w-full overflow-hidden md:hidden"
      aria-live="polite"
      aria-roledescription="carousel"
      aria-label="Why Repairex highlights"
    >
      <div
        className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {whyCards.map((card) => (
          <div key={card.key} className="w-full shrink-0 basis-full px-4">
            <WhyCardItem card={card} mobileSingle />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * @description Why Repairex — GSAP horizontal scrub on tablet/desktop; mobile one-card carousel.
 * @returns {JSX.Element} Why choose section.
 */
export function WhyChooseSection() {
  const pinRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const captionTitleRef = useRef<HTMLHeadingElement>(null)
  const captionDescriptionRef = useRef<HTMLParagraphElement>(null)
  const scrubCaptionIndexRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [layoutMode, setLayoutMode] = useState<WhyLayoutMode>(() => {
    if (typeof window === 'undefined') {
      return 'gsap'
    }
    if (window.matchMedia(WHY_MOBILE_CAROUSEL_MQ).matches) {
      return 'mobile-carousel'
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'reduced-native'
    }
    return 'gsap'
  })
  const [pinStartOffset, setPinStartOffset] = useState(72)

  useLayoutEffect(() => {
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobileMedia = window.matchMedia(WHY_MOBILE_CAROUSEL_MQ)

    const sync = () => {
      if (mobileMedia.matches) {
        setLayoutMode('mobile-carousel')
      } else if (motionMedia.matches) {
        setLayoutMode('reduced-native')
      } else {
        setLayoutMode('gsap')
      }
      setPinStartOffset(72)
    }

    sync()
    motionMedia.addEventListener('change', sync)
    mobileMedia.addEventListener('change', sync)
    return () => {
      motionMedia.removeEventListener('change', sync)
      mobileMedia.removeEventListener('change', sync)
    }
  }, [])

  /**
   * @description Updates caption copy from scrub progress without React re-renders (keeps GSAP transform smooth).
   * @param {number} progress - Normalized horizontal scrub progress.
   * @returns {void}
   */
  const handleProgress = useCallback((progress: number) => {
    const scaled = progress * Math.max(whyCards.length - 1, 1)
    const index = Math.min(
      whyCards.length - 1,
      Math.max(0, Math.round(scaled)),
    )
    if (index === scrubCaptionIndexRef.current) {
      return
    }
    scrubCaptionIndexRef.current = index
    const card = whyCards[index] ?? whyCards[0]
    const title = card.kind === 'stat' ? card.headline : card.title
    if (captionTitleRef.current) {
      captionTitleRef.current.textContent = title
    }
    if (captionDescriptionRef.current) {
      captionDescriptionRef.current.textContent = card.description
    }
  }, [])

  useGsapHorizontalScroll(pinRef, railRef, {
    enabled: layoutMode === 'gsap',
    onProgress: handleProgress,
    pinStartOffset,
  })

  /**
   * @description Updates the caption from the native rail scroll position.
   * @returns {void}
   */
  const syncActiveFromScroll = useCallback(() => {
    const rail = railRef.current
    if (!rail) {
      return
    }
    const cards = rail.querySelectorAll<HTMLElement>('[data-why-card]')
    if (cards.length === 0) {
      return
    }
    const railCenter = rail.scrollLeft + rail.clientWidth / 2
    let closest = 0
    let closestDist = Number.POSITIVE_INFINITY
    cards.forEach((node, index) => {
      const center = node.offsetLeft + node.offsetWidth / 2
      const dist = Math.abs(center - railCenter)
      if (dist < closestDist) {
        closestDist = dist
        closest = index
      }
    })
    setActiveIndex(closest)
  }, [])

  const activeCard = whyCards[activeIndex] ?? whyCards[0]
  const activeTitle =
    activeCard.kind === 'stat' ? activeCard.headline : activeCard.title
  const activeDescription = activeCard.description

  return (
    <SectionSurface
      id="why-repairex"
      tone="band"
      ariaLabel="Why choose Repairex"
      className="why-choose-section !overflow-visible !pb-0"
    >
      <div
        ref={pinRef}
        className={cn(
          'relative flex flex-col py-6 sm:py-8',
          layoutMode === 'gsap' && 'min-h-[calc(100dvh-4.5rem)]',
        )}
      >
        <Container className="shrink-0">
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
        </Container>

        <div
          className={cn(
            'flex w-full flex-col gap-6 pt-6 sm:gap-8 sm:pt-8',
            layoutMode === 'gsap' && 'mt-auto pb-4 sm:pb-6',
          )}
        >
          <WhyMobileCarousel
            enabled={layoutMode === 'mobile-carousel'}
            activeIndex={activeIndex}
            onIndexChange={(index) => {
              setActiveIndex(index)
              scrubCaptionIndexRef.current = index
            }}
          />

          <div
            className={cn(
              'hidden md:block',
              layoutMode === 'gsap'
                ? 'overflow-x-clip overflow-y-visible'
                : 'overflow-visible',
            )}
          >
            <div
              ref={railRef}
              data-native-rail={layoutMode === 'reduced-native' ? 'true' : undefined}
              className={cn(
                'why-cinematic-rail flex items-stretch gap-5 sm:gap-6',
                layoutMode === 'gsap'
                  ? 'w-max pr-[max(1rem,5vw)] pl-[max(1rem,calc((100vw-min(100vw-2rem,80rem))/2+0.5rem))] will-change-transform touch-pan-y'
                  : '-mx-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-1 pb-2',
              )}
              onScroll={layoutMode === 'reduced-native' ? syncActiveFromScroll : undefined}
              aria-label="Why Repairex highlights"
            >
              {whyCards.map((card) => (
                <WhyCardItem
                  key={card.key}
                  card={card}
                  snap={layoutMode === 'reduced-native'}
                />
              ))}
            </div>
          </div>

          <Container className="shrink-0 pb-2 sm:pb-4">
            <WhyCaption
              title={activeTitle}
              description={activeDescription}
              titleRef={layoutMode === 'gsap' ? captionTitleRef : undefined}
              descriptionRef={layoutMode === 'gsap' ? captionDescriptionRef : undefined}
            />
          </Container>
        </div>
      </div>
    </SectionSurface>
  )
}
