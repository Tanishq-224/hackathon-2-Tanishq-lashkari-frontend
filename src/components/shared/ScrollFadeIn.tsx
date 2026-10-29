import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'

import { getScrollTriggerScrollerProps } from '@/lib/gsap-scroll'
import { isTestEnv } from '@/lib/is-test-env'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

type ScrollFadeInTag = 'div' | 'section' | 'ol' | 'ul' | 'article' | 'main'

export type ScrollFadeInProps = {
  children: ReactNode
  as?: ScrollFadeInTag
  className?: string
  style?: CSSProperties
  /** @description Vertical travel in px while fading in. */
  distance?: number
  duration?: number
  ease?: string
  /** @description Viewport threshold (0–1) for early reveal helpers. */
  threshold?: number
  /** @description Wait before motion begins (seconds). */
  delay?: number
  /** @description Seconds between each direct child animation. */
  stagger?: number
  once?: boolean
  disabled?: boolean
  /** @description GSAP ScrollTrigger start string (e.g. `top top+=80` for hero). */
  scrollTriggerStart?: string
}

/**
 * @description Fades content in when it enters the viewport (GSAP ScrollTrigger + Lenis-safe).
 * @param {ScrollFadeInProps} props - Wrapper tag, motion tuning, and children.
 * @returns {JSX.Element} Scroll-revealed wrapper.
 */
export function ScrollFadeIn({
  children,
  as: Tag = 'div',
  className,
  style,
  distance = 24,
  duration = 0.65,
  ease = 'power2.out',
  threshold = 0.08,
  delay = 0,
  stagger = 0.1,
  once = true,
  disabled = false,
  scrollTriggerStart = 'top 85%',
}: ScrollFadeInProps) {
  const ref = useRef<HTMLElement>(null)
  const skipMotion = isTestEnv()

  useLayoutEffect(() => {
    if (disabled || skipMotion) {
      return undefined
    }

    const el = ref.current
    if (!el) {
      return undefined
    }

    const reducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      gsap.set(el, { clearProps: 'all' })
      Array.from(el.children).forEach((child) => {
        gsap.set(child, { clearProps: 'all' })
      })
      return undefined
    }

    const childElements = Array.from(el.children)
    const useChildStagger = stagger > 0 && childElements.length > 1
    const targets = useChildStagger ? childElements : [el]

    const scrollerProps = getScrollTriggerScrollerProps()
    let revealed = false

    /**
     * @description Plays the fade-in tween (idempotent).
     * @param {Partial<gsap.TweenVars>} [overrides] - Optional GSAP overrides.
     * @returns {void}
     */
    const reveal = (overrides?: gsap.TweenVars) => {
      if (revealed && once) {
        return
      }
      revealed = true
      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        duration: overrides?.duration ?? duration,
        ease,
        delay: overrides?.delay ?? delay,
        stagger: useChildStagger ? (overrides?.stagger ?? stagger) : undefined,
        overwrite: 'auto',
      })
    }

    gsap.set(targets, { autoAlpha: 0, y: distance })

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        ...scrollerProps,
        trigger: el,
        start: scrollTriggerStart,
        once,
        invalidateOnRefresh: true,
        onEnter: () => reveal(),
        onEnterBack: () => {
          if (!once) {
            revealed = false
            reveal()
          }
        },
      })
    }, el)

    if (ScrollTrigger.isInViewport(el, threshold)) {
      reveal({ duration: Math.min(duration, 0.5), delay: 0 })
    }

    const intersectionObserver =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  reveal({ duration: Math.min(duration, 0.5), delay: 0 })
                }
              })
            },
            { root: null, threshold: 0.05, rootMargin: '0px 0px -5% 0px' },
          )
        : null

    intersectionObserver?.observe(el)

    /**
     * @description Safety net if ScrollTrigger/Lenis miss the first intersection.
     * @returns {void}
     */
    const safetyReveal = () => {
      const rect = el.getBoundingClientRect()
      const inView =
        rect.top < window.innerHeight * (1 - threshold) && rect.bottom > 0
      if (inView) {
        reveal({ duration: Math.min(duration, 0.5), delay: 0 })
      }
    }

    safetyReveal()
    requestAnimationFrame(safetyReveal)
    window.addEventListener('load', safetyReveal)

    const safetyTimer = window.setTimeout(() => {
      gsap.set(targets, { autoAlpha: 1, y: 0, clearProps: 'transform' })
    }, 2500)

    return () => {
      window.clearTimeout(safetyTimer)
      window.removeEventListener('load', safetyReveal)
      intersectionObserver?.disconnect()
      ctx.revert()
    }
  }, [
    delay,
    disabled,
    distance,
    duration,
    ease,
    once,
    scrollTriggerStart,
    skipMotion,
    stagger,
    threshold,
  ])

  const Component = Tag as ElementType

  return (
    <Component ref={ref} className={cn(className)} style={style}>
      {children}
    </Component>
  )
}
