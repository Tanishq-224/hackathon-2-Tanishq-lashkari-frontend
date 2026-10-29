import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type MarketingPanelProps = {
  children: ReactNode
  className?: string
}

/**
 * @description Elevated card/panel using Repairex theme marketing card tokens.
 * @param {MarketingPanelProps} props - Panel content and optional classes.
 * @returns {JSX.Element} Bordered marketing panel surface.
 */
export function MarketingPanel({ children, className }: MarketingPanelProps) {
  return (
    <div className={cn('theme-marketing-card', className)}>{children}</div>
  )
}
