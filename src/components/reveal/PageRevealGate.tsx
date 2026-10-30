import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'

import { RepairexPreloader } from '@/components/preloader/RepairexPreloader'
import {
  isRevealEligiblePath,
  PAGE_REVEAL_CONFIG,
  resetPageRevealRuntimeState,
  shouldRunPageRevealForSession,
} from '@/components/reveal/page-reveal-config'

type PageRevealGateProps = {
  children: ReactNode
}

/**
 * @description Mounts the Repairex preloader once on eligible public full-page loads (not dashboards).
 * @param {PageRevealGateProps} props - Public layout children.
 * @returns {JSX.Element}
 */
export function PageRevealGate({ children }: PageRevealGateProps) {
  const { pathname } = useLocation()
  const initialPathRef = useRef(pathname)
  const [revealOpen, setRevealOpen] = useState(false)
  const armedRef = useRef(false)

  useLayoutEffect(() => {
    if (armedRef.current) {
      return
    }
    const eligible =
      isRevealEligiblePath(initialPathRef.current) &&
      shouldRunPageRevealForSession()
    if (!eligible) {
      return
    }
    armedRef.current = true
    resetPageRevealRuntimeState()
    setRevealOpen(true)
  }, [])

  const handleComplete = useCallback(() => {
    setRevealOpen(false)
  }, [])

  return (
    <>
      {children}
      {revealOpen ? (
        <RepairexPreloader
          onComplete={handleComplete}
          config={PAGE_REVEAL_CONFIG}
        />
      ) : null}
    </>
  )
}
