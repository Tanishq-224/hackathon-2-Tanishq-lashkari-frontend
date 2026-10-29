import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useLayoutEffect, type ReactNode } from 'react'

gsap.registerPlugin(ScrollTrigger)

type LenisScrollProviderProps = {
  children: ReactNode
}

/**
 * @description Enables Lenis smooth scrolling and keeps GSAP ScrollTrigger in sync (native scroll).
 * @param {LenisScrollProviderProps} props - Layout children to render.
 * @returns {JSX.Element} Children unchanged; scroll + animation drivers attached.
 */
export function LenisScrollProvider({ children }: LenisScrollProviderProps) {
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) {
      ScrollTrigger.refresh()
      return
    }

    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      lerp: 0.09,
      smoothWheel: true,
      respectReducedMotion: true,
    })

    document.documentElement.classList.add('lenis')

    /**
     * @description Keeps ScrollTrigger in sync with Lenis scroll position.
     * @returns {void}
     */
    const onLenisScroll = () => {
      ScrollTrigger.update()
    }

    lenis.on('scroll', onLenisScroll)
    gsap.ticker.lagSmoothing(0)

    /**
     * @description Refreshes Lenis measurements when ScrollTrigger recalculates layout.
     * @returns {void}
     */
    const onScrollTriggerRefresh = () => {
      lenis.resize()
    }

    ScrollTrigger.addEventListener('refresh', onScrollTriggerRefresh)

    /**
     * @description Recalculates scroll triggers after fonts/images shift layout.
     * @returns {void}
     */
    const onWindowLoad = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener('load', onWindowLoad)
    ScrollTrigger.refresh()

    return () => {
      window.removeEventListener('load', onWindowLoad)
      ScrollTrigger.removeEventListener('refresh', onScrollTriggerRefresh)
      lenis.off('scroll', onLenisScroll)
      lenis.destroy()
      document.documentElement.classList.remove('lenis')
      ScrollTrigger.refresh()
    }
  }, [])

  return <>{children}</>
}
