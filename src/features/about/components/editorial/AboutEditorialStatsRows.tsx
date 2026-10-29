import { AboutEditorialShell } from '@/features/about/components/editorial/AboutEditorialShell'

const stats = [
  {
    label: 'Structured workflow stages from request to tracked repair',
    value: '5',
  },
  {
    label: 'Supported device categories in the MVP marketplace',
    value: '3',
  },
  {
    label: 'Estimate layers — preliminary compare, then final quotation',
    value: '2',
  },
] as const

/**
 * @description Product-factual stat rows (no unverified marketing claims).
 * @returns {JSX.Element} Stats section.
 */
export function AboutEditorialStatsRows() {
  return (
    <section
      aria-label="Repairex product structure highlights"
      className="px-4 py-6 sm:px-6 lg:px-8"
    >
      <AboutEditorialShell tone="light" className="space-y-3 p-4 sm:p-5">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col gap-3 rounded-[1.25rem] bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6"
          >
            <p className="max-w-xl text-body leading-relaxed text-[#141414]/75">
              {label}
            </p>
            <p className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-none font-bold tracking-tight text-[#141414]">
              {value}
            </p>
          </div>
        ))}
      </AboutEditorialShell>
    </section>
  )
}
