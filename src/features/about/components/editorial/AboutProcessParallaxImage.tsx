import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, useRef } from 'react'

import { getScrollTriggerScrollerProps } from '@/lib/gsap-scroll'
import { isTestEnv } from '@/lib/is-test-env'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

type AboutProcessParallaxImageProps = {
  src: string
  alt: string
  /** @description Alternate drift direction for visual rhythm. */
  reverse?: boolean
  imageFit?: 'cover' | 'contain'
  className?: string
}

/**
 * @description Scroll-scrubbed vertical parallax inside a clipped frame (Our process thumbnails).
 * @param {AboutProcessParallaxImageProps} props - Image source and frame classes.
 * @returns {JSX.Element} Parallax figure.
 */
export function AboutProcessParallaxImage({
  src,
  alt,
  reverse = false,
  imageFit = 'cover',
  className,
}: AboutProcessParallaxImageProps) {
  const useContain = imageFit === 'contain'
  const frameRef = useRef<HTMLElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const frame = frameRef.current
    const layer = parallaxRef.current
    if (!frame || !layer || isTestEnv() || useContain) {
      return undefined
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      return undefined
    }

    const scrollerProps = getScrollTriggerScrollerProps()
    const fromY = reverse ? 5 : -5
    const toY = reverse ? -5 : 5

    const tween = gsap.fromTo(
      layer,
      { yPercent: fromY, force3D: true },
      {
        yPercent: toY,
        ease: 'none',
        scrollTrigger: {
          trigger: frame,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.45,
          invalidateOnRefresh: true,
          ...scrollerProps,
        },
      },
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [reverse, useContain])

  return (
    <figure
      ref={frameRef}
      className={cn(
        'relative w-full min-w-0 overflow-hidden rounded-2xl border border-border/90 shadow-sm',
        useContain ? 'bg-[#f5f2ea]' : 'bg-muted',
        className,
      )}
    >
      {/* In-flow aspect box — keeps height even when the image layer is absolute */}
      <div
        className="relative w-full min-h-[11.5rem] aspect-[4/3] sm:min-h-[12.5rem] sm:aspect-[16/10] lg:min-h-0 lg:aspect-[5/4]"
        aria-hidden
      />

      <div
        ref={parallaxRef}
        className={cn(
          'pointer-events-none absolute w-full overflow-hidden will-change-transform',
          useContain ? 'inset-0' : 'inset-x-0 top-[-12%] h-[124%]',
        )}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          className={cn(
            'size-full min-h-full min-w-full object-center',
            useContain ? 'object-contain p-1 sm:p-2' : 'object-cover',
          )}
          onLoad={() => {
            ScrollTrigger.refresh()
          }}
        />
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-tr from-primary/20 via-transparent to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] ring-1 ring-inset ring-black/5 dark:ring-white/10"
      />
    </figure>
  )
}
