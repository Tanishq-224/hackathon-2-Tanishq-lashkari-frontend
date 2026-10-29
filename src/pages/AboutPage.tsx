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
    <main className="flex flex-1 flex-col bg-background">
      <AboutEditorialHero />
      <AboutEditorialVisionGrid />
      <AboutEditorialMissionBand />
      <AboutEditorialStatsRows />
      <AboutEditorialWorkflowShowcase />
      <AboutEditorialPrinciples />
      <AboutEditorialClosingCta />
    </main>
  )
}
