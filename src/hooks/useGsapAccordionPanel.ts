import gsap from 'gsap'
import { useLayoutEffect, useRef, type RefObject } from 'react'

type UseGsapAccordionPanelOptions = {
  open: boolean
  reducedMotion?: boolean
}

/**
 * @description Animates FAQ accordion panel height and answer fade/slide with GSAP.
 * @param {RefObject<HTMLElement | null>} panelRef - Outer wrapper whose height is animated.
 * @param {RefObject<HTMLElement | null>} innerRef - Inner content measured for height.
 * @param {UseGsapAccordionPanelOptions} options - Open state and reduced-motion flag.
 * @returns {void}
 */
export function useGsapAccordionPanel(
  panelRef: RefObject<HTMLElement | null>,
  innerRef: RefObject<HTMLElement | null>,
  { open, reducedMotion = false }: UseGsapAccordionPanelOptions,
): void {
  const skipMountAnimationRef = useRef(true)

  useLayoutEffect(() => {
    const panel = panelRef.current
    const inner = innerRef.current

    if (!panel || !inner) {
      return undefined
    }

    gsap.killTweensOf([panel, inner])

    if (reducedMotion) {
      gsap.set(panel, {
        height: open ? 'auto' : 0,
        overflow: open ? 'visible' : 'hidden',
      })
      gsap.set(inner, { opacity: open ? 1 : 0, y: 0 })
      return undefined
    }

    if (skipMountAnimationRef.current && open) {
      skipMountAnimationRef.current = false
      gsap.set(panel, { height: 'auto', overflow: 'visible' })
      gsap.set(inner, { opacity: 1, y: 0 })
      return undefined
    }

    skipMountAnimationRef.current = false

    if (open) {
      gsap.set(panel, { height: 0, overflow: 'hidden' })
      gsap.set(inner, { opacity: 0, y: -8 })

      const targetHeight = inner.scrollHeight

      gsap.to(panel, {
        height: targetHeight,
        duration: 0.48,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(panel, { height: 'auto', overflow: 'visible' })
        },
      })

      gsap.to(inner, {
        opacity: 1,
        y: 0,
        duration: 0.42,
        ease: 'power2.out',
        delay: 0.06,
      })

      return undefined
    }

    const currentHeight = panel.offsetHeight || inner.scrollHeight

    gsap.set(panel, { height: currentHeight, overflow: 'hidden' })

    gsap.to(inner, {
      opacity: 0,
      y: -6,
      duration: 0.22,
      ease: 'power2.in',
    })

    gsap.to(panel, {
      height: 0,
      duration: 0.36,
      ease: 'power2.inOut',
      delay: 0.04,
    })

    return undefined
  }, [innerRef, open, panelRef, reducedMotion])
}
