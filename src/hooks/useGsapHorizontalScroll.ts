import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, type RefObject } from 'react'

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
    pinStartOffset = 56,
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

    /**
     * @description Computes maximum horizontal travel for the rail.
     * @returns {number} Negative pixel distance for `x` transform.
     */
    const getScrollDistance = () => {
      const styles = window.getComputedStyle(railEl)
      const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0
      const paddingRight = Number.parseFloat(styles.paddingRight) || 0
      const travel =
        railEl.scrollWidth - window.innerWidth + paddingLeft + paddingRight + 48

      return -Math.max(0, travel)
    }

    const ctx = gsap.context(() => {
      gsap.to(railEl, {
        x: getScrollDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: pinEl,
          start: `top top+=${pinStartOffset}`,
          end: () => {
            const distance = Math.abs(getScrollDistance())
            return `+=${Math.max(distance, window.innerHeight)}`
          },
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            onProgress?.(self.progress)
          },
        },
      })
    }, pinEl)

    /**
     * @description Refreshes measurements after images load inside the rail.
     * @returns {void}
     */
    const refresh = () => ScrollTrigger.refresh()

    window.addEventListener('load', refresh)
    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(refresh)
        : null

    resizeObserver?.observe(railEl)

    return () => {
      window.removeEventListener('load', refresh)
      resizeObserver?.disconnect()
      ctx.revert()
    }
  }, [enabled, onProgress, pinRef, pinStartOffset, railRef])
}
