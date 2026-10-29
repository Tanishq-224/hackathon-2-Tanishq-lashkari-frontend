import aboutWorkflowImage from '@/assets/cta-factory-background.jpg'
import { Timeline } from '@/components/ui/timeline'
import {
  REPAIREX_ABOUT_TIMELINE_BOTTOM,
  REPAIREX_ABOUT_TIMELINE_TOP,
} from '@/content/about-workflow-timeline'
import { AboutEditorialShell } from '@/features/about/components/editorial/AboutEditorialShell'

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
            Keep scrolling — the timeline pins while you move through each Repairex
            stage, from first request to completed repair.
          </p>
        </AboutEditorialShell>
      </section>

      <Timeline
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
    </div>
  )
}
