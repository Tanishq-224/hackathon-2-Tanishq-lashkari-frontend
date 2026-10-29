import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * @description Copy and CTAs revealed inside the expanded About hero frame.
 * @returns {JSX.Element} In-frame hero content after scroll expansion.
 */
export function AboutExpandHeroPanel() {
  return (
    <div className="about-scroll-hero__overlay mx-auto max-w-2xl px-4 text-white">
      <p className="text-ui font-semibold tracking-[0.18em] text-primary uppercase">
        About Repairex
      </p>
      <h2 className="mt-4 font-display text-h1 font-bold tracking-tight text-white">
        A repair marketplace built on transparent estimates
      </h2>
      <p className="mt-4 text-body-lg leading-relaxed text-white/85">
        Compare vendor estimates, approve final quotes, and track every repair
        stage — one workflow for customers and vendors.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/contact"
          className={cn(
            buttonVariants({
              size: 'lg',
              className: 'h-11 rounded-full px-7',
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
                'h-11 rounded-full border-white/35 bg-white/5 px-7 text-white hover:bg-white/10 hover:text-white',
            }),
          )}
        >
          See the workflow
          <ArrowUpRight aria-hidden className="size-4" />
        </Link>
      </div>
    </div>
  )
}
