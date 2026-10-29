import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import aboutBrandHero from '@/assets/about-brand-hero.jpg'
import aboutHeroPrimary from '@/assets/hero-background.jpg'
import { AboutEditorialShell } from '@/features/about/components/editorial/AboutEditorialShell'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * @description Dark editorial hero with floating brand imagery card.
 * @returns {JSX.Element} About page hero section.
 */
export function AboutEditorialHero() {
  return (
    <section
      aria-label="About Repairex"
      className="px-3 pb-6 pt-3 sm:px-5 sm:pt-4 lg:px-8"
    >
      <AboutEditorialShell className="relative min-h-[min(100dvh,54rem)]">
        <p
          aria-hidden
          className="about-editorial-watermark pointer-events-none absolute top-16 right-4 z-0 font-display font-bold tracking-tight text-white select-none md:top-20 md:right-10"
        >
          Repairex
        </p>

        <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
          <img
            src={aboutHeroPrimary}
            alt=""
            className="size-full scale-110 object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-[#0c0d10]/55 to-[#0c0d10]/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0d10]/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 flex min-h-[min(100dvh,54rem)] flex-col justify-between p-6 sm:p-8 lg:p-10">
          <div className="max-w-3xl pt-[4.5rem] sm:pt-[5rem]">
            <p className="text-ui font-semibold tracking-[0.2em] text-primary uppercase">
              About us
            </p>
            <h1 className="mt-5 font-display text-[clamp(2rem,5.5vw,3.75rem)] leading-[1.05] font-bold tracking-tight text-white">
              We are a repair marketplace rooted in clarity — from first estimate
              to tracked completion.
            </h1>
          </div>

          <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-md text-body-lg leading-relaxed text-white/75">
              Repairex structures phones, laptops, and tablets through
              comparable estimates, diagnosis, informed approval, and visible
              repair progress.
            </p>

            <div className="relative w-full max-w-xs shrink-0 self-end lg:max-w-sm">
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/35 p-2 shadow-2xl backdrop-blur-md">
                <img
                  src={aboutBrandHero}
                  alt="Repairex dashboard preview on a laptop"
                  className="aspect-[4/3] w-full rounded-xl object-cover object-center"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className={cn(
                buttonVariants({
                  size: 'lg',
                  className: 'h-11 rounded-full px-6',
                }),
              )}
            >
              Start a repair request
            </Link>
            <Link
              to="/#how-it-works"
              className={cn(
                buttonVariants({
                  variant: 'outline',
                  size: 'lg',
                  className:
                    'h-11 rounded-full border-white/30 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white',
                }),
              )}
            >
              See the workflow
              <ArrowUpRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </AboutEditorialShell>
    </section>
  )
}
