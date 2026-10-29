import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** @description Visual band styles for full-width marketing sections. */
export type SectionTone = 'canvas' | 'band' | 'accent'

type SectionSurfaceProps = {
  id?: string
  tone?: SectionTone
  children: ReactNode
  className?: string
  ariaLabel?: string
}

/**
 * @description Full-width section shell with layered background (not flat white).
 * @param {SectionSurfaceProps} props - Section metadata, tone, and content.
 * @returns {JSX.Element} Section with decorative background layers.
 */
export function SectionSurface({
  id,
  tone = 'canvas',
  children,
  className,
  ariaLabel,
}: SectionSurfaceProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      role={ariaLabel ? 'region' : undefined}
      className={cn(
        'relative isolate overflow-hidden py-14 sm:py-16 lg:py-20',
        tone === 'canvas' && 'bg-background',
        tone === 'band' && 'bg-section-band',
        tone === 'accent' && 'bg-section-accent',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 section-bg-grid opacity-50"
      />
      {tone === 'band' ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 section-heading-spotlight"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
          />
        </>
      ) : null}
      {tone === 'accent' ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-primary/10 to-transparent"
        />
      ) : null}
      <div className="relative">{children}</div>
    </section>
  )
}
