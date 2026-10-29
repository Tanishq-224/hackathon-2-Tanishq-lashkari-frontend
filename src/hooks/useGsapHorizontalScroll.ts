import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, type RefObject } from 'react'

import { getScrollTriggerScrollerProps } from '@/lib/gsap-scroll'

gsap.registerPlugin(ScrollTrigger)

type UseGsapHorizontalScrollOptions = {
  enabled?: boolean
  /**
   * @description Invoked with normalized scroll progress while scrubbing the rail.
   * @param {number} progress - Value between 0 and 1.
   * @returns {void}
   */
  onProgress?: (progress: number) => void
  /** @description Pixel offset from viewport top when pin starts (navbar). */
  pinStartOffset?: number
}

/**
 * @description Pins a section and scrubs a wide rail horizontally with ScrollTrigger (Lenis-safe).
 * @param {RefObject<HTMLElement | null>} pinRef - Element to pin during the horizontal scrub.
 * @param {RefObject<HTMLElement | null>} railRef - Wide flex rail translated on the x-axis.
 * @param {UseGsapHorizontalScrollOptions} options - Enable flag, progress callback, pin offset.
 * @returns {void}
 */
export function useGsapHorizontalScroll(
  pinRef: RefObject<HTMLElement | null>,
  railRef: RefObject<HTMLElement | null>,
  {
    enabled = true,
    onProgress,
    pinStartOffset = 72,
  }: UseGsapHorizontalScrollOptions = {},
): void {
  useLayoutEffect(() => {
    if (!enabled) {
      return undefined
    }

    const pinEl = pinRef.current
    const railEl = railRef.current
    if (!pinEl || !railEl) {
      return undefined
    }

    gsap.set(railEl, { x: 0, force3D: true })

    /**
     * @description Computes maximum horizontal travel for the rail.
     * @returns {number} Negative pixel distance for `x` transform.
     */
    const getScrollDistance = () => {
      const railWidth = railEl.scrollWidth
      const viewport = window.innerWidth
      const travel = railWidth - viewport + 48
      return -Math.max(0, travel)
    }

    const scrollerProps = getScrollTriggerScrollerProps()
    let ctx: gsap.Context | null = null
    let setupRaf = 0

    /**
     * @description Creates pin + horizontal scrub after layout is measured.
     * @returns {void}
     */
    const setup = () => {
      ctx?.revert()
      ctx = gsap.context(() => {
        gsap.to(railEl, {
          x: getScrollDistance,
          ease: 'none',
          scrollTrigger: {
            ...scrollerProps,
            trigger: pinEl,
            start: `top top+=${pinStartOffset}`,
            end: () => {
              const distance = Math.abs(getScrollDistance())
              return `+=${Math.max(distance * 1.12, window.innerHeight)}`
            },
            pin: true,
            pinSpacing: true,
            pinReparent: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              onProgress?.(self.progress)
            },
          },
        })
      }, pinEl)

      ScrollTrigger.refresh()
    }

    /**
     * @description Refreshes measurements after images load inside the rail.
     * @returns {void}
     */
    const refresh = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener('load', refresh)
    window.addEventListener('resize', refresh)

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(refresh)
        : null

    resizeObserver?.observe(railEl)
    railEl.querySelectorAll('img').forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', refresh, { once: true })
      }
    })

    setupRaf = requestAnimationFrame(() => {
      requestAnimationFrame(setup)
    })

    return () => {
      cancelAnimationFrame(setupRaf)
      window.removeEventListener('load', refresh)
      window.removeEventListener('resize', refresh)
      resizeObserver?.disconnect()
      ctx?.revert()
      gsap.set(railEl, { clearProps: 'transform' })
    }
  }, [enabled, onProgress, pinRef, pinStartOffset, railRef])
}
