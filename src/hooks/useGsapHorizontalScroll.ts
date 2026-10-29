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
     * @description Horizontal travel so the last card sits fully inside the clip frame.
     * @returns {number} Negative pixel distance for the rail `x` transform.
     */
    const getScrollDistance = () => {
      const frame = railEl.parentElement?.clientWidth ?? window.innerWidth
      const travel = railEl.scrollWidth - frame
      return -Math.max(0, travel)
    }

    const scrollerProps = getScrollTriggerScrollerProps()
    let ctx: gsap.Context | null = null
    let setupRaf = 0
    let remeasureTimer = 0
    let lastRailScrollWidth = 0
    let lastViewportWidth = 0

    /**
     * @description Vertical scroll span while pinned — longer than raw travel so wheel input feels gradual, not jumpy.
     * @returns {number}
     */
    const getScrollSpan = () => {
      const travel = Math.abs(getScrollDistance())
      const floor = Math.round(window.innerHeight * 1.15)
      return Math.max(travel, floor, 1)
    }

    /**
     * @description Creates pin + maps scroll progress directly to rail `x` (no tween lag).
     * @returns {void}
     */
    const setup = () => {
      ctx?.revert()
      gsap.set(railEl, { x: 0, force3D: true })

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          ...scrollerProps,
          trigger: pinEl,
          start: `top top+=${pinStartOffset}`,
          end: () => `+=${getScrollSpan()}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 0,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const travel = getScrollDistance()
            gsap.set(railEl, {
              x: self.progress * travel,
              force3D: true,
            })
            onProgress?.(self.progress)
          },
        })
      }, pinEl)

      lastRailScrollWidth = railEl.scrollWidth
      lastViewportWidth = window.innerWidth
      ScrollTrigger.refresh()
    }

    /**
     * @description Rebuilds only when rail width or viewport actually changed (avoids mid-scrub jumps).
     * @returns {void}
     */
    const scheduleRemeasure = () => {
      window.clearTimeout(remeasureTimer)
      remeasureTimer = window.setTimeout(() => {
        const nextRailWidth = railEl.scrollWidth
        const nextViewportWidth = window.innerWidth
        if (
          Math.abs(nextRailWidth - lastRailScrollWidth) < 4 &&
          nextViewportWidth === lastViewportWidth
        ) {
          return
        }
        setup()
      }, 120)
    }

    window.addEventListener('load', scheduleRemeasure)
    window.addEventListener('resize', scheduleRemeasure)

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(scheduleRemeasure)
        : null

    resizeObserver?.observe(railEl)
    railEl.querySelectorAll('img').forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', scheduleRemeasure, { once: true })
      }
    })

    setupRaf = requestAnimationFrame(() => {
      requestAnimationFrame(setup)
    })

    return () => {
      cancelAnimationFrame(setupRaf)
      window.clearTimeout(remeasureTimer)
      window.removeEventListener('load', scheduleRemeasure)
      window.removeEventListener('resize', scheduleRemeasure)
      resizeObserver?.disconnect()
      ctx?.revert()
      gsap.set(railEl, { clearProps: 'transform' })
    }
  }, [enabled, onProgress, pinRef, pinStartOffset, railRef])
}
