import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import aboutCardOne from '@/assets/devices/device-phone.jpg'
import aboutCardTwo from '@/assets/about-vision-quotations.jpg'
import { AboutEditorialShell } from '@/features/about/components/editorial/AboutEditorialShell'
import { cn } from '@/lib/utils'

const valueCards = [
  {
    title: 'Compare before you commit',
    subtitle: 'Structured preliminary estimates from eligible vendors.',
    image: aboutCardOne,
  },
  {
    title: 'Approve with context',
    subtitle: 'Diagnosis notes and itemized final quotations in one place.',
    image: aboutCardTwo,
  },
] as const

/**
 * @description Two-column vision grid mapping to the problem Repairex solves.
 * @returns {JSX.Element} Vision and value cards section.
 */
export function AboutEditorialVisionGrid() {
  return (
    <section
      aria-label="The problem Repairex addresses"
      className="px-4 py-6 sm:px-6 lg:px-8"
    >
      <AboutEditorialShell
        tone="dark"
        className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10 lg:p-10"
      >
        <div className="flex flex-col justify-center lg:sticky lg:top-28 lg:self-start">
          <p className="text-ui font-semibold text-primary">01</p>
          <p className="mt-4 max-w-md text-body leading-relaxed text-white/70">
            Repair is often opaque: unclear pricing, surprise bills, and scattered
            status updates. Repairex focuses on the gap between asking for help
            and knowing what happens next.
          </p>
          <h2 className="mt-6 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight font-bold tracking-tight text-white">
            Empowering informed repair decisions from day one
          </h2>
          <Link
            to="/contact"
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-ui font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Talk to us
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {valueCards.map(({ title, subtitle, image }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#14151a]"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={image}
                  alt=""
                  className="size-full object-cover object-center transition duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-caption font-medium tracking-wide text-white/65 uppercase">
                  {subtitle}
                </p>
                <h3 className="mt-2 font-display text-h3 font-semibold text-white">
                  {title}
                </h3>
                <span
                  className={cn(
                    'mt-4 inline-flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white',
                  )}
                  aria-hidden
                >
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </AboutEditorialShell>
    </section>
  )
}
