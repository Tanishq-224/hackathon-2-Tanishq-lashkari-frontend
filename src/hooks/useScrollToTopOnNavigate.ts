import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * @description Scrolls to the top on route changes; honors in-page hash targets when present.
 * @returns {void}
 */
export function useScrollToTopOnNavigate(): void {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '')
      /**
       * @description Scrolls to a hash target after the next frame when the route DOM is ready.
       * @returns {void}
       */
      const scrollToHash = () => {
        const target = document.getElementById(targetId)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }

      requestAnimationFrame(scrollToHash)
      return undefined
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    return undefined
  }, [hash, pathname])
}
