import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

/**
 * @description Centered marketing section heading (eyebrow, title, description) aligned to Repairex theme tokens.
 * @param {SectionHeaderProps} props - Section title content and layout options.
 * @returns {JSX.Element} Styled section header.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeaderProps) {
  const isCenter = align === 'center'

  return (
    <div
      className={cn(
        'section-heading',
        isCenter && 'mx-auto max-w-3xl text-center',
        !isCenter && 'max-w-4xl text-left',
        className,
      )}
    >
      {eyebrow ? (
        <p className="section-heading-eyebrow text-ui font-bold tracking-[0.16em] text-primary uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="section-heading-title text-h1 mt-4 font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'section-heading-description mt-5 max-w-2xl text-body-lg leading-relaxed text-muted-foreground',
            isCenter && 'mx-auto',
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
