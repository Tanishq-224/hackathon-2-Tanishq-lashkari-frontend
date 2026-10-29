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
          <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight font-bold tracking-tight text-white">
            We specialize in a structured repair journey — not one-off quotes
            lost in chat.
          </h2>
          <p className="mt-5 max-w-lg text-body leading-relaxed text-white/70">
            Select a stage to preview the flow. Replace the large frame with your
            own photography or 3D renders when ready.
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
                      : 'bg-white/8 text-white/75 hover:bg-white/12 hover:text-white',
                  )}
                >
                  {step}
                </button>
              )
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-ui font-semibold text-primary">{activeStep.step}</p>
            <h3 className="mt-2 font-display text-h3 font-semibold text-white">
              {activeStep.title}
            </h3>
            <p className="mt-2 text-body text-white/70">{activeStep.description}</p>
          </div>
        </div>

        <div className="relative min-h-[22rem] overflow-hidden rounded-[1.5rem] border border-white/10 lg:min-h-[32rem]">
          <img
            src={aboutWorkflowImage}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 max-w-[14rem] overflow-hidden rounded-xl border border-white/20 bg-black/45 p-2 backdrop-blur-md sm:max-w-xs">
            <img
              src={aboutWorkflowImage}
              alt=""
              className="aspect-video w-full rounded-lg object-cover"
            />
            <p className="px-1 py-2 text-caption text-white/80">
              Floating preview — swap with your image
            </p>
          </div>
        </div>
      </AboutEditorialShell>
    </section>
  )
}
