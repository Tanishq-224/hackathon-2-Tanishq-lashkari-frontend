import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type ContainerProps = {
  children: ReactNode
  className?: string
}

/**
 * @description Max-width fluid container from the Repairex responsive system.
 * @param {ContainerProps} props - Child content and optional class names.
 * @returns {JSX.Element} Centered content wrapper.
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full px-4', className)}
      style={{ maxWidth: 'var(--container-repairex)' }}
    >
      {children}
    </div>
  )
}
