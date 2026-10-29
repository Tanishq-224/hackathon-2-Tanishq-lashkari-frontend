import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useLayoutEffect, type ReactNode } from 'react'

import { isTestEnv } from '@/lib/is-test-env'
import {
  REPAIREX_SCROLL_LOCK_EVENT,
  type RepairexScrollLockDetail,
} from '@/lib/scroll-lock'

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
      autoRaf: false,
      anchors: true,
      lerp: 0.12,
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

    /**
     * @description Drives Lenis from GSAP ticker so scrubbed ScrollTriggers track the wheel 1:1.
     * @param {number} time - GSAP ticker time in seconds.
     * @returns {void}
     */
    const onGsapTick = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(onGsapTick)

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

    /**
     * @description Lets scroll-expansion heroes pause Lenis while capturing wheel input.
     * @param {Event} event - Custom lock event.
     * @returns {void}
     */
    const onRepairexScrollLock = (event: Event) => {
      const { locked } = (event as CustomEvent<RepairexScrollLockDetail>).detail
      if (locked) {
        lenis.stop()
      } else {
        lenis.start()
        lenis.resize()
      }
    }

    window.addEventListener(REPAIREX_SCROLL_LOCK_EVENT, onRepairexScrollLock)
    window.addEventListener('load', onWindowLoad)
    ScrollTrigger.refresh()
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

    return () => {
      window.removeEventListener(REPAIREX_SCROLL_LOCK_EVENT, onRepairexScrollLock)
      window.removeEventListener('load', onWindowLoad)
      ScrollTrigger.removeEventListener('refresh', onScrollTriggerRefresh)
      gsap.ticker.remove(onGsapTick)
      lenis.off('scroll', onLenisScroll)
      lenis.destroy()
      document.documentElement.classList.remove('lenis')
      ScrollTrigger.refresh()
    }
  }, [])

  return <>{children}</>
}
