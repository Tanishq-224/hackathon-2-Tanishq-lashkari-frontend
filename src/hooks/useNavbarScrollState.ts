import { useEffect, useState } from 'react'

/**
 * @description Tracks whether the page has scrolled past a threshold (for navbar surface changes).
 * @param {number} threshold - Scroll offset in pixels before marking as scrolled.
 * @returns {boolean} True when scroll position exceeds the threshold.
 * @example
 * const isScrolled = useNavbarScrollState(12)
 */
export function useNavbarScrollState(threshold = 12): boolean {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    /**
     * @description Syncs navbar scroll state with the current window scroll offset.
     * @returns {void}
     */
    const updateScrollState = () => {
      setIsScrolled(window.scrollY > threshold)
    }

    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateScrollState)
    }
  }, [threshold])

  return isScrolled
}
