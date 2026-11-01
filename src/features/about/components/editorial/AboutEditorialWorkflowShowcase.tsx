import { REPAIREX_ABOUT_PROCESS_STEPS } from '@/content/about-repair-process'
import { AboutEditorialShell } from '@/features/about/components/editorial/AboutEditorialShell'
import { AboutProcessParallaxImage } from '@/features/about/components/editorial/AboutProcessParallaxImage'
import { cn } from '@/lib/utils'

/**
 * @description Reference-style “Our process” block — five steps, all breakpoints (no scroll pin).
 * @returns {JSX.Element} Structured repair journey section.
 */
export function AboutEditorialWorkflowShowcase() {
  return (
    <section
      aria-label="Structured repair journey"
      className="about-workflow-showcase px-4 py-6 sm:px-6 lg:px-8"
    >
      <AboutEditorialShell tone="light" className="p-6 sm:p-8 lg:p-12">
        <header className="max-w-3xl border-b border-border/80 pb-8 lg:pb-10">
          <p className="text-ui font-semibold tracking-[0.16em] text-primary uppercase">
            Our process
          </p>
          <h2
            id="about-workflow-intro"
            className="mt-4 font-display text-[clamp(1.85rem,4.2vw,3rem)] leading-[1.12] font-bold tracking-tight text-foreground"
          >
            How we move from{' '}
            <span className="text-muted-foreground">request to repair complete</span>
          </h2>
          <p className="mt-4 max-w-2xl text-body leading-relaxed text-muted-foreground">
            One structured journey — not one-off quotes lost in chat. Every stage below
            is built into Repairex so customers and vendors share the same timeline.
          </p>
        </header>

        <ol className="mt-2 list-none">
          {REPAIREX_ABOUT_PROCESS_STEPS.map((step, index) => (
            <li
              key={step.id}
              className={cn(
                'grid gap-5 py-8 sm:gap-6 sm:py-10',
                'sm:grid-cols-[minmax(2.75rem,auto)_minmax(0,1fr)] sm:items-start',
                'lg:grid-cols-[minmax(3rem,auto)_minmax(0,1fr)_minmax(12rem,16rem)] lg:items-center lg:gap-x-10',
                index < REPAIREX_ABOUT_PROCESS_STEPS.length - 1 && 'border-b border-border/80',
              )}
            >
              <span
                aria-hidden
                className="font-display text-[clamp(1.35rem,2.5vw,1.75rem)] font-semibold tabular-nums text-muted-foreground/75 sm:pt-0.5 lg:row-span-1"
              >
                {step.number}
              </span>

              <div className="min-w-0 sm:col-start-2 lg:col-start-2">
                <h3 className="font-display text-[clamp(1.15rem,2.2vw,1.45rem)] font-bold leading-snug tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2.5 max-w-xl text-body leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>

              <AboutProcessParallaxImage
                src={step.image}
                alt={step.imageAlt}
                imageFit={step.imageFit}
                reverse={index % 2 === 1}
                className={cn(
                  'w-full sm:col-span-2 sm:max-w-lg',
                  'lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:w-full lg:max-w-none lg:justify-self-stretch',
                )}
              />
            </li>
          ))}
        </ol>
      </AboutEditorialShell>
    </section>
  )
}
