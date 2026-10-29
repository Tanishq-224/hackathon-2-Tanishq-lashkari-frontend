import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useLayoutEffect, type ReactNode } from 'react'

import { isTestEnv } from '@/lib/is-test-env'

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
    if (isTestEnv()) {
      return undefined
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) {
      ScrollTrigger.refresh()
      return undefined
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

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (typeof value === 'number') {
          lenis.scrollTo(value, { immediate: true })
        }
        return lenis.scroll
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
      pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
    })

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
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

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
