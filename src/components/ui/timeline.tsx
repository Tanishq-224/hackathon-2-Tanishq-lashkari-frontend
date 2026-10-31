import {
  type CSSProperties,
  useLayoutEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

import { getScrollTriggerScrollerProps } from '@/lib/gsap-scroll'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText)
}

const monthOrder = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
} as const

type Month = keyof typeof monthOrder

export type TimelineJourneyItem = {
  id: string
  year: string
  month: Month
  content: string
  headline?: string
  sortKey?: number
}

type SplitTextInstance = InstanceType<typeof SplitText>

export type TimelineProps = {
  title?: string
  periodLabel?: string
  textColor?: string
  mutedTextColor?: string
  activeColor?: string
  backgroundColor?: string
  imageUrl?: string
  imageAlt?: string
  duration?: number
  scrollDuration?: number
  topJourneyData?: TimelineJourneyItem[]
  bottomJourneyData?: TimelineJourneyItem[]
  className?: string
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === 'undefined') return () => {}

  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY)
  mediaQueryList.addEventListener('change', callback)

  return () => mediaQueryList.removeEventListener('change', callback)
}

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return false

  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false
}

function getServerReducedMotionSnapshot() {
  return false
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  )
}

const defaultTopJourneyData: TimelineJourneyItem[] = [
  {
    id: '2020-march',
    year: '2020',
    month: 'March',
    content: 'Signal research turns scattered notes into a clear product thesis',
  },
  {
    id: '2021-july',
    year: '2021',
    month: 'July',
    content: 'Founding release ships with the first live customer journeys',
  },
  {
    id: '2023-april',
    year: '2023',
    month: 'April',
    content: 'Automation layer connects insight, publishing, and sales motion',
  },
  {
    id: '2026-may',
    year: '2026',
    month: 'May',
    content: 'New markets open with localized launches and faster onboarding',
  },
]

const defaultBottomJourneyData: TimelineJourneyItem[] = [
  {
    id: '2020-november',
    year: '2020',
    month: 'November',
    content: 'Prototype sprint validates the experience with real operators',
  },
  {
    id: '2022-october',
    year: '2022',
    month: 'October',
    content: 'Community feedback reshapes the roadmap into sharper releases',
  },
  {
    id: '2025-september',
    year: '2025',
    month: 'September',
    content: 'Companion mobile workflows make the timeline travel-ready',
  },
]

function sortJourneyItems(items: TimelineJourneyItem[]) {
  return [...items].sort((a, b) => {
    if (a.sortKey != null && b.sortKey != null) {
      return a.sortKey - b.sortKey
    }
    const yearDiff = Number(a.year) - Number(b.year)
    if (yearDiff !== 0) return yearDiff
    return monthOrder[a.month] - monthOrder[b.month]
  })
}

function journeyHeadline(item: TimelineJourneyItem) {
  return item.headline ?? item.content.slice(0, 48)
}

const DESKTOP_NAV_OFFSET = '4.5rem'

/**
 * @description Horizontal scroll-pinned timeline with GSAP ScrollTrigger (Lenis-safe).
 */
export function Timeline({
  title = 'Product Storyline',
  periodLabel = '2020-2026',
  textColor = 'var(--color-foreground, #000000)',
  mutedTextColor = 'var(--color-muted-foreground, #3f3f46)',
  activeColor = '#ff5f00',
  backgroundColor = 'var(--color-background, #ffffff)',
  imageUrl = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
  imageAlt = 'Modern repair workshop',
  duration,
  scrollDuration = 1.2,
  topJourneyData = defaultTopJourneyData,
  bottomJourneyData = defaultBottomJourneyData,
  className,
}: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const pinViewportRef = useRef<HTMLDivElement>(null)
  const wholeSliderRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const animationDuration = duration ?? scrollDuration
  const normalizedDuration = Math.max(0.2, animationDuration)
  const allJourneyItems = useMemo(
    () => sortJourneyItems([...topJourneyData, ...bottomJourneyData]),
    [topJourneyData, bottomJourneyData],
  )

  const sectionStyle: CSSProperties = {
    color: textColor,
    backgroundColor,
  }
  const activeStyle: CSSProperties = {
    backgroundColor: activeColor,
  }
  const mutedTextStyle: CSSProperties = {
    color: mutedTextColor,
  }

  useLayoutEffect(() => {
    const section = sectionRef.current
    const pinViewport = pinViewportRef.current
    const slider = wholeSliderRef.current

    if (!section || !pinViewport || !slider) {
      return undefined
    }

    const scrollerProps = getScrollTriggerScrollerProps()
    const isMobile = window.innerWidth < 600
    const slidePercent = isMobile ? -57 : -65
    const lineWidth = isMobile ? '65%' : '98%'
    const lineStart = isMobile ? 'top 30%' : 'top 25%'
    const slideEnd = isMobile ? '82% 50%' : '92% bottom'
    const lineEnd = isMobile ? '80% 50%' : '92% bottom'
    const items = allJourneyItems

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: `top top+=${DESKTOP_NAV_OFFSET}`,
          end: slideEnd,
          scrub: true,
          pin: pinViewport,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          ...scrollerProps,
        },
        defaults: {
          ease: 'none',
        },
      })

      tl.fromTo(slider, { xPercent: 0 }, { xPercent: slidePercent })

      if (reducedMotion) {
        gsap.set('.journey-line', { width: lineWidth })
        items.forEach((item) => {
          gsap.set(`.jl-${item.id}`, { scaleY: 1 })
          gsap.set(`.jd-${item.id}`, { scale: 1 })
          gsap.set(`.title-${item.id}`, { opacity: 1, clearProps: 'transform' })
          gsap.set(`.description-${item.id}`, {
            opacity: 1,
            clearProps: 'transform',
          })
        })
        return
      }

      gsap.to('.journey-line', {
        width: lineWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: lineStart,
          end: lineEnd,
          scrub: true,
          invalidateOnRefresh: true,
          ...scrollerProps,
        },
      })

      items.forEach((item) => {
        gsap.set(`.jl-${item.id}`, {
          scaleY: 0,
          transformOrigin: 'bottom bottom',
        })
        gsap.set(`.jd-${item.id}`, { scale: 0 })
        gsap.set(`.title-${item.id}`, { opacity: 1 })
        gsap.set(`.description-${item.id}`, { opacity: 1 })
      })

      const titleSplits: Partial<Record<string, SplitTextInstance>> = {}
      const descriptionSplits: Partial<Record<string, SplitTextInstance>> = {}

      items.forEach((item) => {
        const titleEl = section.querySelector(`.title-${item.id}`)
        const descriptionEl = section.querySelector(`.description-${item.id}`)
        if (!titleEl || !descriptionEl) {
          return
        }

        try {
          titleSplits[item.id] = new SplitText(titleEl, {
            type: 'chars, words, lines',
            mask: 'lines',
          })
          descriptionSplits[item.id] = new SplitText(descriptionEl, {
            type: 'chars, words, lines',
            mask: 'lines',
          })
        } catch {
          /* Club SplitText unavailable — fall back to whole nodes in createItemTimeline */
        }
      })

      /**
       * @description Per-step scrub timeline for markers and copy reveal.
       * @param {TimelineJourneyItem} item - Journey step.
       * @param {number} startPos - ScrollTrigger start percentage.
       * @param {number} endPos - ScrollTrigger end percentage.
       * @returns {gsap.core.Timeline}
       */
      const createItemTimeline = (
        item: TimelineJourneyItem,
        startPos: number,
        endPos: number,
      ) => {
        const lineSelector = `.jl-${item.id}`
        const dotSelector = `.jd-${item.id}`
        const titleEl = section.querySelector(`.title-${item.id}`)
        const descriptionEl = section.querySelector(`.description-${item.id}`)
        const titleLines =
          titleSplits[item.id]?.lines?.length && titleSplits[item.id]?.lines
            ? titleSplits[item.id].lines
            : titleEl
              ? [titleEl]
              : []
        const descriptionLines =
          descriptionSplits[item.id]?.lines?.length &&
          descriptionSplits[item.id]?.lines
            ? descriptionSplits[item.id].lines
            : descriptionEl
              ? [descriptionEl]
              : []

        const isTop = topJourneyData.some((topItem) => topItem.id === item.id)

        if (!isTop) {
          gsap.set(lineSelector, { transformOrigin: 'top top' })
        }

        const itemTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: `${startPos}% 30%`,
            end: `${endPos}% 50%`,
            scrub: true,
            invalidateOnRefresh: true,
            ...scrollerProps,
          },
        })

        itemTimeline
          .to(lineSelector, {
            scaleY: 1,
            duration: normalizedDuration * 0.4,
          })
          .to(
            dotSelector,
            {
              scale: 1,
              duration: normalizedDuration * 0.4,
            },
            '<',
          )

        if (titleLines.length > 0) {
          itemTimeline.fromTo(
            titleLines,
            { y: 100 },
            {
              y: 0,
              delay: -0.8 * normalizedDuration,
              duration: normalizedDuration,
              stagger: 0.02,
              ease: 'power2.out',
            },
          )
        }

        if (descriptionLines.length > 0) {
          itemTimeline.fromTo(
            descriptionLines,
            { y: 100 },
            {
              y: 0,
              duration: normalizedDuration,
              stagger: 0.02,
              ease: 'power2.out',
            },
            titleLines.length > 0 ? '<' : undefined,
          )
        }

        return itemTimeline
      }

      const positions: ReadonlyArray<readonly [number, number]> = isMobile
        ? [
            [22, 32],
            [28, 38],
            [36, 46],
            [45, 55],
            [52, 62],
            [60, 70],
            [69, 79],
          ]
        : [
            [6, 26],
            [16, 36],
            [26, 46],
            [35, 55],
            [45, 65],
            [55, 75],
            [65, 85],
          ]

      items.forEach((item, index) => {
        const [startPos, endPos] = positions[index] ?? [6, 26]
        createItemTimeline(item, startPos, endPos)
      })
    }, section)

    /**
     * @description Refreshes triggers after About hero / images shift layout.
     * @returns {void}
     */
    const refreshScrollTriggers = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener('resize', refreshScrollTriggers)
    window.addEventListener('load', refreshScrollTriggers)
    requestAnimationFrame(refreshScrollTriggers)

    return () => {
      window.removeEventListener('resize', refreshScrollTriggers)
      window.removeEventListener('load', refreshScrollTriggers)
      ctx.revert()
    }
  }, [
    allJourneyItems,
    normalizedDuration,
    reducedMotion,
    topJourneyData,
    bottomJourneyData,
  ])

  return (
    <section
      ref={sectionRef}
      id="about-repair-journey"
      className={`relative h-[200vw] w-full max-[600px]:h-[400vh] ${className ?? ''}`}
      style={sectionStyle}
      aria-label="Repair workflow overview — structured repair journey timeline"
    >
      <div
        ref={pinViewportRef}
        className="h-screen w-full overflow-hidden pt-[10%] max-[600px]:pt-[5%]"
      >
        <div
          ref={wholeSliderRef}
          className="mr-[2vw] flex h-[30vw] w-[240vw] items-center gap-[5vw] px-[5vw] max-[600px]:h-[80vh] max-[600px]:w-[800vw] max-[600px]:px-[7vw]"
        >
          <div className="h-full w-[30vw] overflow-hidden rounded-[1vw] max-[600px]:h-[65vw] max-[600px]:w-[85vw] max-[600px]:rounded-[5vw]">
            <img
              src={imageUrl}
              alt={imageAlt}
              draggable={false}
              className="size-full object-cover"
            />
          </div>

          <div className="relative h-full w-full">
            <div className="absolute left-0 top-[49%] flex h-fit w-full translate-y-[-50%] items-center">
              <div
                className="size-[0.8vw] rounded-full max-[600px]:size-[2vw]"
                style={activeStyle}
              />
              <div
                className="journey-line h-px w-[0%] rounded-full"
                style={activeStyle}
              />
              <div
                className="size-[0.8vw] rounded-full max-[600px]:size-[2vw]"
                style={activeStyle}
              />
            </div>

            <div className="flex h-1/2 w-full items-center justify-start gap-[0.5vw]">
              <div className="h-full w-[20%] pt-[2vw] max-[600px]:h-fit max-[600px]:pt-[5vw]">
                <h2 className="w-[65%] font-display text-[3vw] leading-[0.95] max-[600px]:text-[8.5vw]">
                  {title}
                </h2>
              </div>

              <div className="flex h-full w-full gap-x-[15vw] max-[600px]:gap-x-[40vw]">
                {topJourneyData.map((item) => (
                  <div
                    key={`top-${item.id}`}
                    className="relative h-full w-[30vw] px-[3vw] max-[600px]:flex max-[600px]:w-[70vw] max-[600px]:flex-col max-[600px]:px-[7vw]"
                  >
                    <div className="absolute bottom-0 left-0 top-0 h-full w-full">
                      <div
                        className={`jd-${item.id} relative aspect-square size-[1vw] translate-x-[-50%] rounded-full max-[600px]:size-[2.5vw]`}
                        style={activeStyle}
                      />
                      <div
                        className={`jl-${item.id} h-[94%] w-px origin-bottom rounded-full`}
                        style={activeStyle}
                      />
                    </div>

                    <div className="mt-[-1vw] space-y-[1vw] max-[600px]:mt-[-2vw]">
                      <h4
                        className={`title-${item.id} font-display text-[2.5vw] leading-none max-[600px]:text-[6.4vw]`}
                      >
                        {journeyHeadline(item)}
                      </h4>
                      <p
                        className={`description-${item.id} w-[90%] text-[1.5vw] leading-[1.15] max-[600px]:w-[90%] max-[600px]:text-[4.8vw]`}
                        style={mutedTextStyle}
                      >
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex h-1/2 w-full items-center justify-start">
              <div className="h-full w-[34%] pt-[2vw] max-[600px]:w-[30%] max-[600px]:pt-[5vw]">
                <p
                  className="text-[1.65vw] leading-none max-[600px]:text-[4.2vw]"
                  style={mutedTextStyle}
                >
                  {periodLabel}
                </p>
              </div>

              <div className="ml-[7vw] flex h-full w-full gap-x-[20vw] max-[600px]:ml-[7vw] max-[600px]:gap-x-[40vw]">
                {bottomJourneyData.map((item) => (
                  <div
                    key={`bottom-${item.id}`}
                    className="relative h-full w-[25vw] px-[3vw] max-[600px]:w-[70vw] max-[600px]:px-[7vw]"
                  >
                    <div className="absolute bottom-[-1%] left-0 h-full w-full">
                      <div
                        className={`jl-${item.id} h-[94%] w-px origin-top rounded-full max-[600px]:h-full`}
                        style={activeStyle}
                      />
                      <div
                        className={`jd-${item.id} relative aspect-square size-[1vw] translate-x-[-50%] rounded-full max-[600px]:size-[2.5vw]`}
                        style={activeStyle}
                      />
                    </div>

                    <div className="flex h-full w-full flex-col justify-end space-y-[1vw]">
                      <h4
                        className={`title-${item.id} font-display text-[2.5vw] leading-none max-[600px]:text-[6.4vw]`}
                      >
                        {journeyHeadline(item)}
                      </h4>
                      <p
                        className={`description-${item.id} w-[90%] text-[1.5vw] leading-[1.15] max-[600px]:w-[90%] max-[600px]:text-[4.8vw]`}
                        style={mutedTextStyle}
                      >
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Timeline
