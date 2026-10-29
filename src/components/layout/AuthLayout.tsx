import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { RepairexBrandMark } from '@/components/layout/RepairexBrandMark'
import { Container } from '@/components/shared/Container'

type AuthLayoutProps = {
  children: ReactNode
}

/**
 * @description Focused auth shell without public footer (Phase 1 layout; forms in Phase 2).
 * @param {AuthLayoutProps} props - Page content.
 * @returns {JSX.Element} Branded authentication page wrapper.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="border-b border-border/80 bg-background/95 px-4 py-4 sm:px-6">
        <Container className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 font-display text-ui font-bold text-foreground"
          >
            <RepairexBrandMark className="size-9" />
            Repairex
          </Link>
          <Link
            to="/"
            className="text-ui font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Back to home
          </Link>
        </Container>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  )
}
