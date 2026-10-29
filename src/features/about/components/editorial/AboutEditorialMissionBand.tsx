import aboutAccountabilityProgress from '@/assets/about-accountability-progress.jpg'
import { AboutEditorialShell } from '@/features/about/components/editorial/AboutEditorialShell'

/**
 * @description Light mission band (warm card) between dark editorial sections.
 * @returns {JSX.Element} Mission statement section.
 */
export function AboutEditorialMissionBand() {
  return (
    <section
      aria-label="The Repairex solution"
      className="px-4 py-6 sm:px-6 lg:px-8"
    >
      <AboutEditorialShell tone="light" className="p-6 sm:p-8 lg:p-12">
        <p className="mx-auto max-w-4xl text-center font-display text-[clamp(1.5rem,3.6vw,2.65rem)] leading-snug font-bold tracking-tight text-foreground">
          <span className="text-muted-foreground">
            We connect customers and vendors through a single workflow —
          </span>{' '}
          structured requests, comparable estimates, explicit approval, and
          tracked repair status.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] lg:gap-6">
          <div
            className="relative overflow-hidden rounded-[1.35rem] border border-border bg-muted"
            id="about-workflow-media"
          >
            <img
              src={aboutAccountabilityProgress}
              alt="Repairex workflow from request submitted through comparing estimates, approval, and in-repair status on dashboard"
              className="aspect-[16/10] w-full bg-primary/10 object-cover object-center scale-[1.02]"
            />
          </div>

          <aside className="theme-marketing-card flex flex-col justify-between rounded-[1.35rem] border border-border/80 p-6">
            <div>
              <p className="text-ui font-semibold tracking-[0.16em] text-primary uppercase">
                Accountability
              </p>
              <h3 className="mt-3 font-display text-h2 font-bold tracking-tight text-foreground">
                One record of progress
              </h3>
              <p className="mt-4 text-body leading-relaxed text-muted-foreground">
                After you approve a final quotation, vendors update repair
                milestones in the platform so customers are not left chasing
                updates across calls and chats.
              </p>
            </div>
          </aside>
        </div>
      </AboutEditorialShell>
    </section>
  )
}
