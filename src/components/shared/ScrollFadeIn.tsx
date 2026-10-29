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
}: ScrollFadeInProps) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (disabled) {
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

    const ctx = gsap.context(() => {
      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        duration,
        ease,
        delay,
        stagger: useChildStagger ? stagger : undefined,
        scrollTrigger: {
          trigger: el,
          start: `top ${(1 - threshold) * 100}%`,
          once,
          invalidateOnRefresh: true,
        },
      })
    }, el)

    return () => {
      ctx.revert()
    }
  }, [
    delay,
    disabled,
    distance,
    duration,
    ease,
    once,
    stagger,
    threshold,
  ])

  const Component = Tag as ElementType
  const usesChildStagger = stagger > 0 && Children.count(children) > 1

  return (
    <Component
      ref={ref}
      className={cn(!usesChildStagger && !disabled && 'opacity-0', className)}
      style={style}
    >
      {children}
    </Component>
  )
}
