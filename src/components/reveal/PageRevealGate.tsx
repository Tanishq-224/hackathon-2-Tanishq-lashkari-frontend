import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

import { PageReveal } from '@/components/reveal/PageReveal'
import {
  isRevealEligiblePath,
  PAGE_REVEAL_CONFIG,
  shouldRunPageRevealForSession,
} from '@/components/reveal/page-reveal-config'

type PageRevealGateProps = {
  children: ReactNode
}

/**
 * @description Mounts PageReveal once on eligible public full-page loads (not dashboards).
 * @param {PageRevealGateProps} props - Public layout children.
 * @returns {JSX.Element}
 */
export function PageRevealGate({ children }: PageRevealGateProps) {
  const { pathname } = useLocation()
  const initialPathRef = useRef(pathname)

  const initialOpen = useMemo(() => {
    return (
      isRevealEligiblePath(initialPathRef.current) &&
      shouldRunPageRevealForSession()
    )
  }, [])

  const [revealOpen, setRevealOpen] = useState(initialOpen)

  const handleComplete = useCallback(() => {
    setRevealOpen(false)
  }, [])

  return (
    <>
      {children}
      {revealOpen ? (
        <PageReveal onComplete={handleComplete} config={PAGE_REVEAL_CONFIG} />
      ) : null}
    </>
  )
}
