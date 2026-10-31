import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'

import type { StepTimelineItem } from '@/components/ui/step-timeline'
import { StepTimeline } from '@/components/ui/step-timeline'
import type { TimelineJourneyItem } from '@/components/ui/timeline'
import { getScrollTriggerScrollerProps } from '@/lib/gsap-scroll'
import { cn } from '@/lib/utils'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const NAV_OFFSET = '4.5rem'

type AboutRepairJourneyResponsiveTimelineProps = {
  title?: string
  periodLabel?: string
  phases: TimelineJourneyItem[]
}

function phaseTitle(item: TimelineJourneyItem) {
  return item.headline ?? 'Repair step'
}

function buildStepItems(
  phases: TimelineJourneyItem[],
  activeIndex: number,
): StepTimelineItem[] {
  const ordered = [...phases].sort((a, b) => (a.sortKey ?? 0) - (b.sortKey ?? 0))

  return ordered.map((phase, index) => {
    let status: StepTimelineItem['status'] = 'pending'
    if (index < activeIndex) {
      status = 'completed'
    } else if (index === activeIndex) {
      status = 'active'
    }

    return {
      id: phase.id,
      title: phaseTitle(phase),
      description: phase.content,
      status,
    }
  })
}

/**
 * @description Vertical scroll-scrubbed repair journey for phones and tablets.
 */
export function AboutRepairJourneyResponsiveTimeline({
  title = 'Structured repair journey',
  periodLabel = 'Request → complete',
  phases,
}: AboutRepairJourneyResponsiveTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const orderedPhases = useMemo(
    () => [...phases].sort((a, b) => (a.sortKey ?? 0) - (b.sortKey ?? 0)),
    [phases],
  )

  const items = useMemo(
    () => buildStepItems(orderedPhases, activeIndex),
    [orderedPhases, activeIndex],
  )

  useLayoutEffect(() => {
    const section = sectionRef.current
    const pinEl = pinRef.current
    if (!section || !pinEl || orderedPhases.length === 0) {
      return undefined
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      setActiveIndex(orderedPhases.length - 1)
      return undefined
    }

    const scrollerProps = getScrollTriggerScrollerProps()
    let lastIndex = -1

    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>('[data-journey-step]', pinEl)

      steps.forEach((stepEl) => {
        gsap.set(stepEl, { opacity: 0.4, y: 24 })
      })

      const master = gsap.timeline({
        scrollTrigger: {
          ...scrollerProps,
          trigger: section,
          start: `top top+=${NAV_OFFSET}`,
          end: 'bottom bottom',
          scrub: 0.55,
          pin: pinEl,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const nextIndex = Math.min(
              orderedPhases.length - 1,
              Math.floor(self.progress * orderedPhases.length),
            )
            if (nextIndex !== lastIndex) {
              lastIndex = nextIndex
              setActiveIndex(nextIndex)
            }
          },
        },
      })

      steps.forEach((stepEl) => {
        master.to(
          stepEl,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
          },
          '>',
        )
      })
    }, section)

    const refresh = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('load', refresh)
    requestAnimationFrame(refresh)

    return () => {
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [orderedPhases])

  return (
    <section
      ref={sectionRef}
      className="lg:hidden"
      style={{
        backgroundColor: '#0c0d10',
        minHeight: `${Math.max(orderedPhases.length, 4) * 90}vh`,
      }}
      aria-label="Structured repair journey"
    >
      <div
        ref={pinRef}
        className="mx-auto flex w-full max-w-3xl flex-col justify-center px-4 py-10 sm:px-6 sm:py-12"
      >
        <p className="text-caption font-semibold uppercase tracking-wider text-primary">
          {periodLabel}
        </p>
        <h2 className="mt-2 font-display text-h2 font-bold tracking-tight text-[#f3efe6]">
          {title}
        </h2>
        <p className="mt-3 text-ui text-white/60">Scroll to walk through each stage.</p>

        <div
          className={cn(
            'mt-8',
            '[&_.text-foreground]:text-[#f3efe6]',
            '[&_.text-muted-foreground]:text-white/70',
            '[&_.bg-background]:bg-[#14161a]',
          )}
        >
          <StepTimeline
            items={items}
            variant="spacious"
            orientation="vertical"
            showTimestamps={false}
          />
        </div>
      </div>
    </section>
  )
}
