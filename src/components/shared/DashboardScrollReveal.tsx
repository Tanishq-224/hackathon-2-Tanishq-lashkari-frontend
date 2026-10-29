import type { ReactNode } from 'react'

import { ScrollFadeIn } from '@/components/shared/ScrollFadeIn'
import { isTestEnv } from '@/lib/is-test-env'

type DashboardScrollRevealProps = {
  children: ReactNode
  className?: string
}

/**
 * @description Soft GSAP fade-in for dashboard pages (fast, minimal travel).
 * @param {DashboardScrollRevealProps} props - Page content to reveal.
 * @returns {JSX.Element} Animated wrapper.
 */
export function DashboardScrollReveal({
  children,
  className,
}: DashboardScrollRevealProps) {
  return (
    <ScrollFadeIn
      className={className}
      distance={14}
      duration={0.55}
      delay={0.05}
      stagger={0.06}
      threshold={0.05}
      disabled={isTestEnv()}
    >
      {children}
    </ScrollFadeIn>
  )
}
