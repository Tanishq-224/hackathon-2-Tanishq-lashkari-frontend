import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type AboutEditorialShellProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  /** @description Dark editorial block vs warm light card (mixed About layout). */
  tone?: 'dark' | 'light'
}

/**
 * @description Rounded editorial frame — dark/light mix on the About page.
 * @param {AboutEditorialShellProps} props - Shell tone and content.
 * @returns {JSX.Element} Padded rounded container.
 */
export function AboutEditorialShell({
  children,
  className,
  tone = 'dark',
  ...rest
}: AboutEditorialShellProps) {
  return (
    <div
      {...rest}
      className={cn(
        'about-editorial-shell mx-auto w-full max-w-[88rem] overflow-hidden rounded-[1.75rem] md:rounded-[2.25rem]',
        tone === 'dark' &&
          'border border-white/10 bg-[#0c0d10] text-white shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)]',
        tone === 'light' &&
          'theme-marketing-card border border-border bg-card text-card-foreground shadow-[var(--card-elevated-shadow)]',
        className,
      )}
    >
      {children}
    </div>
  )
}
