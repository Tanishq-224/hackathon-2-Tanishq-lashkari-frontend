import { Play } from 'lucide-react'
import { Link } from 'react-router-dom'

import aboutMissionMedia from '@/assets/devices/device-laptop-work.png'
import { AboutEditorialShell } from '@/features/about/components/editorial/AboutEditorialShell'

/**
 * @description Light mission band with media row (Repairex solution — no fake testimonials).
 * @returns {JSX.Element} Mission statement section.
 */
export function AboutEditorialMissionBand() {
  return (
    <section
      aria-label="The Repairex solution"
      className="px-4 py-6 sm:px-6 lg:px-8"
    >
      <AboutEditorialShell tone="light" className="p-6 sm:p-8 lg:p-12">
        <p className="mx-auto max-w-4xl text-center font-display text-[clamp(1.5rem,3.6vw,2.65rem)] leading-snug font-bold tracking-tight text-[#141414]">
          <span className="text-[#141414]/45">
            We connect customers and vendors through a single workflow —
          </span>{' '}
          structured requests, comparable estimates, explicit approval, and
          tracked repair status.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] lg:gap-6">
          <div
            className="relative overflow-hidden rounded-[1.35rem] bg-[#141414]"
            id="about-workflow-media"
          >
            <img
              src={aboutMissionMedia}
              alt=""
              className="aspect-[16/10] w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-black/25" />
            <Link
              to="/#how-it-works"
              className="absolute inset-0 flex items-center justify-center"
              aria-label="Open home workflow section"
            >
              <span className="flex size-16 items-center justify-center rounded-full bg-white/95 text-[#141414] shadow-lg transition hover:scale-105">
                <Play aria-hidden className="ml-1 size-7 fill-current" />
              </span>
            </Link>
          </div>

          <aside className="flex flex-col justify-between rounded-[1.35rem] border border-[#141414]/10 bg-white p-6 shadow-sm">
            <div>
              <p className="text-ui font-semibold tracking-[0.16em] text-primary uppercase">
                Accountability
              </p>
              <h3 className="mt-3 font-display text-h2 font-bold tracking-tight text-[#141414]">
                One record of progress
              </h3>
              <p className="mt-4 text-body leading-relaxed text-[#141414]/70">
                After you approve a final quotation, vendors update repair
                milestones in the platform so customers are not left chasing
                updates across calls and chats.
              </p>
            </div>
            <p className="mt-8 text-caption text-[#141414]/55">
              Swap the media frame above with your own process video or photo.
            </p>
          </aside>
        </div>
      </AboutEditorialShell>
    </section>
  )
}
