import { MarketingPanel } from '@/components/shared/MarketingPanel'
import { PageSection } from '@/components/shared/PageSection'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { REPAIR_WORKFLOW_STEPS } from '@/content/repair-workflow-steps'

/**
 * @description Explains the end-to-end Repairex repair workflow on the home page.
 * @returns {JSX.Element} How it works section.
 */
export function HowItWorksSection() {
  return (
    <PageSection
      id="how-it-works"
      tone="canvas"
      ariaLabel="How Repairex works"
      scrollReveal={false}
    >
      <SectionHeader
        eyebrow="Workflow"
        title="How Repairex works"
        description="From first request to completed repair, every step is structured so you stay informed before approving costs."
      />
      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {REPAIR_WORKFLOW_STEPS.map(({ step, title, description }) => (
          <li key={step}>
            <MarketingPanel className="flex h-full flex-col p-5">
              <span className="text-ui font-semibold text-primary">{step}</span>
              <h3 className="mt-3 font-display text-h3 font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-2 flex-1 text-body text-muted-foreground">
                {description}
              </p>
            </MarketingPanel>
          </li>
        ))}
      </ol>
    </PageSection>
  )
}
