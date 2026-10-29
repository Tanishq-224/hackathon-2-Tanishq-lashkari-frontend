import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type AboutEditorialShellProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  tone?: 'dark' | 'light'
}

/**
 * @description Rounded editorial frame used across the About page sections.
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
        tone === 'dark' && 'bg-[#0c0d10] text-white',
        tone === 'light' && 'bg-[#f3efe6] text-[#141414]',
        className,
      )}
    >
      {children}
    </div>
  )
}
