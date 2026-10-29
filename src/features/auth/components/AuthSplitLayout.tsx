import type { ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'

import defaultAuthImage from '@/assets/login-visual.jpg'
import { RepairexBrandMark } from '@/components/layout/RepairexBrandMark'

export type AuthSplitLayoutProps = {
  title: string
  subtitle: string
  badge?: string
  imageSrc?: string
  imageAlt?: string
  quoteTitle?: string
  quoteDescription?: string
  highlights?: string[]
  children: ReactNode
  footer?: ReactNode
}

/**
 * @description Full-screen edge-to-edge auth layout with full viewport height imagery and theme-aware form container.
 * @param {AuthSplitLayoutProps} props - Layout options and form children.
 * @returns {JSX.Element} Full screen auth layout section.
 */
export function AuthSplitLayout({
  title,
  subtitle,
  badge = 'Repairex Verified',
  imageSrc = defaultAuthImage,
  imageAlt = 'Repairex Smart Electronics Repair',
  quoteTitle = 'Clear repair decisions, from estimate to completion.',
  quoteDescription = 'Join customers and certified vendors using structured requests, itemized quotations, and tracked repair milestones.',
  highlights = [
    'Verified repair technicians',
    'Itemized quotations with zero surprises',
    'Customer approval before repair work',
  ],
  children,
  footer,
}: AuthSplitLayoutProps) {
  return (
    <main className="w-full flex-1">
      <div className="grid min-h-screen w-full lg:grid-cols-12">
        {/* Full-Screen Visual Showcase Side (Desktop lg+) */}
        <div className="relative hidden min-h-screen flex-col justify-between overflow-hidden p-8 pt-28 pb-12 select-none lg:col-span-5 lg:flex xl:col-span-6 xl:p-14 xl:pt-32">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 size-full object-cover object-center transition-transform duration-1000 hover:scale-105"
          />
          {/* Deep gradient overlays for text contrast and premium feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/35" />
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />

          {/* Floating Badge (Pushed below floating navbar) */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-3.5 py-1.5 backdrop-blur-md">
              <RepairexBrandMark className="size-5" />
              <span className="text-caption font-semibold tracking-wider text-white uppercase">
                {badge}
              </span>
            </div>
          </div>

          {/* Glassmorphic Value Card at Bottom */}
          <div className="relative z-10 space-y-4 rounded-2xl border border-white/15 bg-black/60 p-6 backdrop-blur-md shadow-2xl">
            <h2 className="font-display text-h3 font-bold text-white drop-shadow-sm">
              {quoteTitle}
            </h2>
            <p className="text-body text-white/85 leading-relaxed">
              {quoteDescription}
            </p>
            {highlights && highlights.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {highlights.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-2.5 py-1 text-caption font-medium text-white/95"
                  >
                    <CheckCircle2 className="size-3.5 text-primary" />
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Mobile / Tablet Image Banner (< lg) */}
        <div className="relative flex min-h-[16rem] flex-col justify-end overflow-hidden p-6 pt-24 pb-8 sm:min-h-[20rem] sm:p-8 sm:pt-28 lg:hidden select-none">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 size-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/60 to-black/40" />
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1 backdrop-blur-md">
              <RepairexBrandMark className="size-4" />
              <span className="text-caption font-semibold tracking-wider text-white uppercase">
                {badge}
              </span>
            </div>
            <p className="font-display text-h3 font-bold text-white drop-shadow-sm">
              {quoteTitle}
            </p>
          </div>
        </div>

        {/* Form Side (Full height with generous top padding for navbar) */}
        <div className="flex min-h-screen flex-col justify-center px-6 py-12 pt-10 sm:px-10 sm:py-16 sm:pt-14 lg:col-span-7 lg:px-14 lg:pt-28 lg:pb-16 xl:col-span-6 xl:px-18 xl:pt-32">
          <div className="mx-auto w-full max-w-lg">
            <div className="mb-8 space-y-2">
              <h1 className="font-display text-h2 font-bold tracking-tight text-foreground">
                {title}
              </h1>
              <p className="text-body text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div>{children}</div>

            {footer ? (
              <div className="mt-8 border-t border-border/70 pt-6 text-center text-ui text-muted-foreground">
                {footer}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  )
}
