import { useState } from 'react'

import aboutWorkflowImage from '@/assets/hero-background.jpg'
import { AboutEditorialShell } from '@/features/about/components/editorial/AboutEditorialShell'
import { REPAIR_WORKFLOW_STEPS } from '@/content/repair-workflow-steps'
import { cn } from '@/lib/utils'

/**
 * @description Visual workflow section with step selector and media frame.
 * @returns {JSX.Element} Repair workflow showcase.
 */
export function AboutEditorialWorkflowShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeStep = REPAIR_WORKFLOW_STEPS[activeIndex] ?? REPAIR_WORKFLOW_STEPS[0]

  return (
    <section
      aria-label="Repair workflow overview"
      className="px-4 py-6 sm:px-6 lg:px-8"
    >
      <AboutEditorialShell className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
        <div className="flex flex-col justify-center lg:sticky lg:top-28 lg:self-start">
          <p className="text-ui font-semibold text-primary">02</p>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight font-bold tracking-tight text-foreground">
            We specialize in a structured repair journey — not one-off quotes
            lost in chat.
          </h2>
          <p className="mt-5 max-w-lg text-body leading-relaxed text-muted-foreground">
            Tap a stage to see what happens next in the Repairex workflow — the
            same path customers follow from the home page.
          </p>

          <div
            className="mt-8 flex flex-wrap gap-2"
            role="tablist"
            aria-label="Workflow stages"
          >
            {REPAIR_WORKFLOW_STEPS.map(({ step }, index) => {
              const isActive = index === activeIndex

              return (
                <button
                  key={step}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveIndex(index)
                  }}
                  className={cn(
                    'rounded-full px-4 py-2 text-ui font-semibold transition',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                >
                  {step}
                </button>
              )
            })}
          </div>

          <div className="theme-marketing-card mt-8 rounded-2xl p-5">
            <p className="text-ui font-semibold text-primary">{activeStep.step}</p>
            <h3 className="mt-2 font-display text-h3 font-semibold text-foreground">
              {activeStep.title}
            </h3>
            <p className="mt-2 text-body text-muted-foreground">
              {activeStep.description}
            </p>
          </div>
        </div>

        <div className="relative min-h-[22rem] overflow-hidden rounded-[1.5rem] border border-border lg:min-h-[32rem]">
          <img
            src={aboutWorkflowImage}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-transparent" />
        </div>
      </AboutEditorialShell>
    </section>
  )
}
