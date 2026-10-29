/**
 * @description Returns Lenis scroll root when smooth scroll is active.
 * @returns {Element | undefined}
 */
export function getLenisScrollRoot(): Element | undefined {
  if (typeof document === 'undefined') {
    return undefined
  }

  return document.documentElement.classList.contains('lenis')
    ? document.documentElement
    : undefined
}

/**
 * @description Spread into ScrollTrigger configs when Lenis `scrollerProxy` is active.
 * @returns {{ scroller?: Element }}
 */
export function getScrollTriggerScrollerProps(): { scroller?: Element } {
  const scroller = getLenisScrollRoot()
  return scroller ? { scroller } : {}
}
