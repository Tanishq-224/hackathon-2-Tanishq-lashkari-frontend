import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Children,
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
  /** @description Viewport threshold (0–1) before animation starts. */
  threshold?: number
  /** @description Wait after scroll trigger before motion begins (seconds). */
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
  distance = 28,
  duration = 0.78,
  ease = 'power2.out',
  threshold = 0.15,
  delay = 0.2,
  stagger = 0.12,
  once = true,
  disabled = false,
  scrollTriggerStart = 'top 92%',
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

    gsap.set(targets, { autoAlpha: 0, y: distance })

    const scrollerProps = getScrollTriggerScrollerProps()

    const ctx = gsap.context(() => {
      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        duration,
        ease,
        delay,
        stagger: useChildStagger ? stagger : undefined,
        scrollTrigger: {
          ...scrollerProps,
          trigger: el,
          start: scrollTriggerStart,
          once,
          invalidateOnRefresh: true,
        },
      })
    }, el)

    /**
     * @description Reveals above-the-fold blocks that are already in view on first paint.
     */
    const revealIfVisible = () => {
      ScrollTrigger.refresh()
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight * (1 - threshold) && rect.bottom > 0) {
        gsap.to(targets, {
          autoAlpha: 1,
          y: 0,
          duration: Math.min(duration, 0.45),
          ease,
          delay: 0,
          stagger: useChildStagger ? Math.min(stagger, 0.05) : undefined,
          overwrite: 'auto',
        })
      }
    }

    revealIfVisible()
    requestAnimationFrame(revealIfVisible)
    window.addEventListener('load', revealIfVisible)

    return () => {
      window.removeEventListener('load', revealIfVisible)
      ctx.revert()
    }
  }, [
    delay,
    disabled,
    distance,
    duration,
    ease,
    skipMotion,
    once,
    scrollTriggerStart,
    stagger,
    threshold,
  ])

  const Component = Tag as ElementType
  const usesChildStagger = stagger > 0 && Children.count(children) > 1
  const hideUntilReveal = !usesChildStagger && !disabled && !skipMotion

  return (
    <Component
      ref={ref}
      className={cn(hideUntilReveal && 'opacity-0', className)}
      style={style}
    >
      {children}
    </Component>
  )
}
