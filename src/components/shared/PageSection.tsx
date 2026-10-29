import type { ReactNode } from 'react'

import { Container } from '@/components/shared/Container'
import {
  ScrollFadeIn,
  type ScrollFadeInProps,
} from '@/components/shared/ScrollFadeIn'
import {
  SectionSurface,
  type SectionTone,
} from '@/components/shared/SectionSurface'

type PageSectionProps = {
  id?: string
  children: ReactNode
  className?: string
  containerClassName?: string
  ariaLabel?: string
  tone?: SectionTone
  /** @description When false, skips scroll-triggered fade for this section. */
  scrollReveal?: boolean
  revealClassName?: string
  revealDelay?: ScrollFadeInProps['delay']
  revealStagger?: ScrollFadeInProps['stagger']
}

/**
 * @description Marketing section with container and layered section background.
 * @param {PageSectionProps} props - Section id, tone, children, and styling overrides.
 * @returns {JSX.Element} Full-width section block.
 */
export function PageSection({
  id,
  children,
  className,
  containerClassName,
  ariaLabel,
  tone = 'canvas',
  scrollReveal = true,
  revealClassName,
  revealDelay = 0.22,
  revealStagger = 0.12,
}: PageSectionProps) {
  return (
    <SectionSurface
      id={id}
      tone={tone}
      ariaLabel={ariaLabel}
      className={className}
    >
      <Container className={containerClassName}>
        <ScrollFadeIn
          disabled={!scrollReveal}
          className={revealClassName}
          delay={revealDelay}
          stagger={revealStagger}
        >
          {children}
        </ScrollFadeIn>
      </Container>
    </SectionSurface>
  )
}
