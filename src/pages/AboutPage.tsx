import { ScrollFadeIn } from '@/components/shared/ScrollFadeIn'
import { AboutEditorialClosingCta } from '@/features/about/components/editorial/AboutEditorialClosingCta'
import { AboutEditorialHero } from '@/features/about/components/editorial/AboutEditorialHero'
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
      <ScrollFadeIn distance={20} duration={0.65} delay={0.08} threshold={0.02}>
        <AboutEditorialHero />
      </ScrollFadeIn>
      <ScrollFadeIn distance={24} stagger={0.1}>
        <AboutEditorialVisionGrid />
      </ScrollFadeIn>
      <ScrollFadeIn distance={24} stagger={0.1}>
        <AboutEditorialMissionBand />
      </ScrollFadeIn>
      <ScrollFadeIn distance={24} stagger={0.08}>
        <AboutEditorialStatsRows />
      </ScrollFadeIn>
      <ScrollFadeIn distance={24}>
        <AboutEditorialWorkflowShowcase />
      </ScrollFadeIn>
      <ScrollFadeIn distance={24} stagger={0.1}>
        <AboutEditorialPrinciples />
      </ScrollFadeIn>
      <ScrollFadeIn distance={20}>
        <AboutEditorialClosingCta />
      </ScrollFadeIn>
    </main>
  )
}
