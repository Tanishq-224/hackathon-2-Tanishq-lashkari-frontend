import { ScrollFadeIn } from '@/components/shared/ScrollFadeIn'
import { AboutEditorialClosingCta } from '@/features/about/components/editorial/AboutEditorialClosingCta'
import { AboutEditorialScrollHero } from '@/features/about/components/editorial/AboutEditorialScrollHero'
import { AboutEditorialMissionBand } from '@/features/about/components/editorial/AboutEditorialMissionBand'
import { AboutEditorialPrinciples } from '@/features/about/components/editorial/AboutEditorialPrinciples'
import { AboutEditorialStatsRows } from '@/features/about/components/editorial/AboutEditorialStatsRows'
import { AboutEditorialVisionGrid } from '@/features/about/components/editorial/AboutEditorialVisionGrid'
import { AboutEditorialWorkflowShowcase } from '@/features/about/components/editorial/AboutEditorialWorkflowShowcase'

/**
 * @description About Us page — editorial layout (image slots for later).
 * @returns {JSX.Element} Full Repairex about page.
 */
export function AboutPage() {
  return (
    <main className="about-editorial flex flex-1 flex-col bg-[#08090b]">
      {/* No ScrollFadeIn — scroll-expansion hero owns wheel + layout at page top */}
      <AboutEditorialScrollHero />
      <ScrollFadeIn distance={24} stagger={0.1}>
        <AboutEditorialVisionGrid />
      </ScrollFadeIn>
      <ScrollFadeIn distance={24} stagger={0.1}>
        <AboutEditorialMissionBand />
      </ScrollFadeIn>
      <ScrollFadeIn distance={24} stagger={0.08}>
        <AboutEditorialStatsRows />
      </ScrollFadeIn>
      {/* No ScrollFadeIn — GSAP pin + horizontal scrub need a stable scroll root */}
      <AboutEditorialWorkflowShowcase />
      <ScrollFadeIn distance={24} stagger={0.1}>
        <AboutEditorialPrinciples />
      </ScrollFadeIn>
      <ScrollFadeIn distance={20}>
        <AboutEditorialClosingCta />
      </ScrollFadeIn>
    </main>
  )
}
