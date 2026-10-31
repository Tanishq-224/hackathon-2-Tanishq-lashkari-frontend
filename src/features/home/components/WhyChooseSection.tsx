import { ArrowRight } from 'lucide-react'
import {
  useCallback,
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
}: {
  card: WhyCard
  snap: boolean
}) {
  const shellClass = cn(
    'flex shrink-0',
    whyCardHeightClass,
    whyCardWidthClass(card.kind === 'visual' ? card.wide : false),
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

/**
 * @description Why Repairex — pinned GSAP horizontal scrub on all viewports (native swipe rail only for reduced motion).
 * @returns {JSX.Element} Why choose section.
 */
export function WhyChooseSection() {
  const pinRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const captionTitleRef = useRef<HTMLHeadingElement>(null)
  const captionDescriptionRef = useRef<HTMLParagraphElement>(null)
  const scrubCaptionIndexRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [useNativeRail, setUseNativeRail] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  const [pinStartOffset, setPinStartOffset] = useState(72)

  useLayoutEffect(() => {
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    const compactNavMedia = window.matchMedia('(max-width: 639px)')

    /**
     * @description Falls back to native horizontal swipe only when the user prefers reduced motion.
     * @returns {void}
     */
    const sync = () => {
      setUseNativeRail(motionMedia.matches)
      setPinStartOffset(compactNavMedia.matches ? 64 : 72)
    }

    sync()
    motionMedia.addEventListener('change', sync)
    compactNavMedia.addEventListener('change', sync)
    return () => {
      motionMedia.removeEventListener('change', sync)
      compactNavMedia.removeEventListener('change', sync)
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
    enabled: !useNativeRail,
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
          !useNativeRail && 'min-h-[calc(100dvh-4.5rem)]',
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
            'mt-auto flex w-full flex-col gap-6 pt-6 sm:gap-8 sm:pt-8',
            !useNativeRail && 'pb-4 sm:pb-6',
          )}
        >
          <div
            className={cn(
              useNativeRail ? 'overflow-visible' : 'overflow-x-clip overflow-y-visible',
            )}
          >
            <div
              ref={railRef}
              data-native-rail={useNativeRail ? 'true' : undefined}
              className={cn(
                'why-cinematic-rail flex items-stretch gap-5 sm:gap-6',
                useNativeRail
                  ? '-mx-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-1 pb-2'
                  : 'w-max pr-[max(1rem,5vw)] pl-[max(1rem,calc((100vw-min(100vw-2rem,80rem))/2+0.5rem))] will-change-transform touch-pan-y',
              )}
              onScroll={useNativeRail ? syncActiveFromScroll : undefined}
              aria-label="Why Repairex highlights"
            >
              {whyCards.map((card) => (
                <WhyCardItem
                  key={card.key}
                  card={card}
                  snap={useNativeRail}
                />
              ))}
            </div>
          </div>

          <Container className="shrink-0 pb-2 sm:pb-4">
            <WhyCaption
              title={activeTitle}
              description={activeDescription}
              titleRef={useNativeRail ? undefined : captionTitleRef}
              descriptionRef={useNativeRail ? undefined : captionDescriptionRef}
            />
          </Container>
        </div>
      </div>
    </SectionSurface>
  )
}
