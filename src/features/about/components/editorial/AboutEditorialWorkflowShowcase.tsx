import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, useState } from 'react'

import aboutWorkflowImage from '@/assets/cta-factory-background.jpg'
import { Timeline } from '@/components/ui/timeline'
import {
  getRepairexAboutTimelinePhases,
  REPAIREX_ABOUT_TIMELINE_BOTTOM,
  REPAIREX_ABOUT_TIMELINE_TOP,
} from '@/content/about-workflow-timeline'
import { AboutRepairJourneyResponsiveTimeline } from '@/features/about/components/editorial/AboutRepairJourneyResponsiveTimeline'
import { AboutEditorialShell } from '@/features/about/components/editorial/AboutEditorialShell'

const DESKTOP_TIMELINE_MQ = '(min-width: 1024px)'

const TIMELINE_THEME = {
  textColor: '#f3efe6',
  mutedTextColor: 'rgba(243, 239, 230, 0.68)',
  activeColor: '#e66418',
  backgroundColor: '#0c0d10',
  duration: 1.2,
} as const

/**
 * @description Horizontal scroll-pinned repair journey (replaces static step tabs).
 * @returns {JSX.Element} Workflow timeline section.
 */
export function AboutEditorialWorkflowShowcase() {
  const [showDesktopTimeline, setShowDesktopTimeline] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }
    return window.matchMedia(DESKTOP_TIMELINE_MQ).matches
  })

  useLayoutEffect(() => {
    const media = window.matchMedia(DESKTOP_TIMELINE_MQ)
    const sync = () => {
      setShowDesktopTimeline(media.matches)
      if (media.matches) {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh()
        })
      }
    }
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return (
    <div className="about-workflow-showcase">
      <section
        aria-labelledby="about-workflow-intro"
        className="px-4 pb-2 pt-6 sm:px-6 lg:px-8"
      >
        <AboutEditorialShell className="p-6 sm:p-8 lg:p-10">
          <p className="text-ui font-semibold text-primary">02</p>
          <h2
            id="about-workflow-intro"
            className="mt-4 max-w-3xl font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight font-bold tracking-tight text-white"
          >
            We specialize in a structured repair journey — not one-off quotes lost
            in chat.
          </h2>
          <p className="mt-5 max-w-2xl text-body leading-relaxed text-white/70">
            <span className="lg:hidden">
              Each step below shows how Repairex moves from first request to completed
              repair.
            </span>
            <span className="hidden lg:inline">
              Keep scrolling — the timeline pins while you move through each Repairex
              stage, from first request to completed repair.
            </span>
          </p>
        </AboutEditorialShell>
      </section>

      <AboutRepairJourneyResponsiveTimeline phases={getRepairexAboutTimelinePhases()} />

      {showDesktopTimeline ? (
        <Timeline
          key="desktop-repair-journey-timeline"
          title="Structured repair journey"
          periodLabel="Request → complete"
          backgroundColor={TIMELINE_THEME.backgroundColor}
          textColor={TIMELINE_THEME.textColor}
          mutedTextColor={TIMELINE_THEME.mutedTextColor}
          activeColor={TIMELINE_THEME.activeColor}
          imageUrl={aboutWorkflowImage}
          imageAlt="Precision repair bench and structured workflow environment"
          duration={TIMELINE_THEME.duration}
          topJourneyData={REPAIREX_ABOUT_TIMELINE_TOP}
          bottomJourneyData={REPAIREX_ABOUT_TIMELINE_BOTTOM}
          className="rounded-none"
        />
      ) : null}
    </div>
  )
}
