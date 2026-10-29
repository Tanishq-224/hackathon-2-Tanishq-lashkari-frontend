import { AboutEditorialShell } from '@/features/about/components/editorial/AboutEditorialShell'

const principles = [
  {
    title: 'Transparency',
    body: 'Estimates, findings, and final quotations stay visible before you approve spend.',
  },
  {
    title: 'Informed approval',
    body: 'Work proceeds after you review diagnosis — not on vague verbal promises.',
  },
  {
    title: 'Accountability',
    body: 'Vendors update repair status so everyone shares one timeline.',
  },
] as const

/**
 * @description Product principles section styled as editorial cards.
 * @returns {JSX.Element} Principles grid.
 */
export function AboutEditorialPrinciples() {
  return (
    <section
      aria-label="Product principles"
      className="px-4 py-6 sm:px-6 lg:px-8"
    >
      <AboutEditorialShell tone="dark" className="p-6 sm:p-8 lg:p-10">
        <div className="max-w-2xl">
          <p className="text-ui font-semibold tracking-[0.16em] text-primary uppercase">
            Principles
          </p>
          <h2 className="mt-3 font-display text-h1 font-bold tracking-tight text-white">
            Built around clarity, consent, and follow-through
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {principles.map(({ title, body }) => (
            <article
              key={title}
              className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-6"
            >
              <h3 className="font-display text-h3 font-semibold text-white">
                {title}
              </h3>
              <p className="mt-3 text-body leading-relaxed text-white/70">
                {body}
              </p>
            </article>
          ))}
        </div>
      </AboutEditorialShell>
    </section>
  )
}
