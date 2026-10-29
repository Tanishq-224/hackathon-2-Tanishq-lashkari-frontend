import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type DashboardScrollRevealProps = {
  children: ReactNode
  className?: string
}

/**
 * @description Dashboard content wrapper — no scroll-driven opacity (keeps repair flows instantly visible).
 * @param {DashboardScrollRevealProps} props - Page content.
 * @returns {JSX.Element} Stable layout wrapper.
 */
export function DashboardScrollReveal({
  children,
  className,
}: DashboardScrollRevealProps) {
  return <div className={cn('min-w-0', className)}>{children}</div>
}
