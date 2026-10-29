import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type AboutEditorialShellProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  /** @description Canvas = elevated card; band = warm stripe (matches home/contact sections). */
  tone?: 'canvas' | 'band'
}

/**
 * @description Rounded editorial frame aligned with Repairex marketing surfaces.
 * @param {AboutEditorialShellProps} props - Shell tone and content.
 * @returns {JSX.Element} Padded rounded container.
 */
export function AboutEditorialShell({
  children,
  className,
  tone = 'canvas',
  ...rest
}: AboutEditorialShellProps) {
  return (
    <div
      {...rest}
      className={cn(
        'about-editorial-shell mx-auto w-full max-w-[88rem] overflow-hidden rounded-[1.75rem] border border-border md:rounded-[2.25rem]',
        tone === 'canvas' &&
          'theme-marketing-card bg-card text-card-foreground shadow-[var(--card-elevated-shadow)]',
        tone === 'band' && 'bg-section-band text-foreground',
        className,
      )}
    >
      {children}
    </div>
  )
}
