import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from 'react'

import { isTestEnv } from '@/lib/is-test-env'
import { cn } from '@/lib/utils'

import './scroll-expansion-hero.css'

/**
 * @description Clamps a number between a minimum and maximum value.
 * @param {number} value - Input value.
 * @param {number} min - Lower bound.
 * @param {number} max - Upper bound.
 * @returns {number} Clamped value.
 */
function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min
  }
  if (value > max) {
    return max
  }
  return value
}

/**
 * @description Hermite smoothstep interpolation between two edges.
 * @param {number} edge0 - Start edge.
 * @param {number} edge1 - End edge.
 * @param {number} x - Sample position.
 * @returns {number} Interpolated value in [0, 1].
 */
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1)
  return t * t * (3 - 2 * t)
}

export type ScrollExpandMediaProps = {
  mediaType?: 'video' | 'image'
  mediaSrc: string
  posterSrc?: string
  bgImageSrc: string
  title?: string
  date?: string
  scrollToExpand?: string
  textBlend?: boolean
  children?: ReactNode
  className?: string
  ariaLabel?: string
  scrollDistance?: number
  holdDistance?: number
  smoothing?: number
  mediaZoom?: number
  overlayScrim?: number
}

type MotionConfig = {
  scrollDistance: number
  holdDistance: number
  smoothing: number
  mediaZoom: number
  overlayScrim: number
}

/**
 * @description Scroll-driven expansion hero — original layout, Contact-grade scroll engine (Lenis-safe).
 * @param {ScrollExpandMediaProps} props - Media, copy, motion tuning, in-frame overlay slot.
 * @returns {JSX.Element} Window-scroll expansion hero.
 */
export function ScrollExpandMedia({
  mediaType = 'image',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
  className,
  ariaLabel = 'Hero',
  scrollDistance = 0.95,
  holdDistance = 0.15,
  smoothing = 0,
  mediaZoom = 1.28,
  overlayScrim = 0.5,
}: ScrollExpandMediaProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const titleFirstRef = useRef<HTMLHeadingElement>(null)
  const titleRestRef = useRef<HTMLHeadingElement>(null)
  const dateRef = useRef<HTMLParagraphElement>(null)
  const hintRef = useRef<HTMLParagraphElement>(null)

  const configRef = useRef<MotionConfig>({
    scrollDistance,
    holdDistance,
    smoothing,
    mediaZoom,
    overlayScrim,
  })

  useLayoutEffect(() => {
    configRef.current = {
      scrollDistance,
      holdDistance,
      smoothing,
      mediaZoom,
      overlayScrim,
    }
  }, [scrollDistance, holdDistance, smoothing, mediaZoom, overlayScrim])

  const firstWord = title ? title.split(' ')[0] : ''
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : ''

  /**
   * @description Maps normalized scroll progress to box size, titles, and overlay (smoothstep eased).
   * @param {number} progress - Raw scroll progress 0–1.
   * @returns {void}
   */
  const applyProgress = useCallback(
    (progress: number) => {
      const eased = smoothstep(0, 1, progress)
      const mobile = window.innerWidth < 768
      const config = configRef.current

      const mediaWidth = 300 + eased * (mobile ? 650 : 1250)
      const mediaHeight = 400 + eased * (mobile ? 200 : 400)
      const textShift = eased * (mobile ? 18 : 14)

      if (bgRef.current) {
        bgRef.current.style.opacity = `${1 - eased * 0.92}`
      }

      if (boxRef.current) {
        boxRef.current.style.width = `${mediaWidth}px`
        boxRef.current.style.height = `${mediaHeight}px`
      }

      const zoom = config.mediaZoom
      if (mediaRef.current) {
        mediaRef.current.style.transform = `scale(${zoom + (1 - zoom) * eased})`
      }

      if (scrimRef.current) {
        scrimRef.current.style.opacity = `${config.overlayScrim * eased}`
      }

      if (overlayRef.current) {
        const overlayIn = smoothstep(0.68, 1, progress)
        overlayRef.current.style.opacity = `${overlayIn}`
        overlayRef.current.style.transform = `translate3d(0, ${18 * (1 - overlayIn)}px, 0)`
      }

      const titleOut = smoothstep(0.38, 0.82, progress)
      const titleScale = 1 + 0.05 * titleOut
      if (titleFirstRef.current) {
        titleFirstRef.current.style.opacity = `${1 - titleOut}`
        titleFirstRef.current.style.transform = `translate3d(${-textShift}vw, ${-22 * titleOut}px, 0) scale(${titleScale})`
      }
      if (titleRestRef.current) {
        titleRestRef.current.style.opacity = `${1 - titleOut}`
        titleRestRef.current.style.transform = `translate3d(${textShift}vw, ${-22 * titleOut}px, 0) scale(${titleScale})`
      }

      if (dateRef.current) {
        dateRef.current.style.opacity = `${1 - smoothstep(0.2, 0.55, progress)}`
        dateRef.current.style.transform = `translate3d(${-textShift}vw, 0, 0)`
      }

      if (hintRef.current) {
        hintRef.current.style.opacity = `${1 - smoothstep(0, 0.14, progress)}`
        hintRef.current.style.transform = `translate3d(${textShift}vw, 0, 0)`
      }

    },
    [],
  )

  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    const stage = stageRef.current
    if (!root || !track || !stage) {
      return undefined
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    let motionRaf = 0
    let syncRaf = 0
    let current = 0
    let target = 0
    let stageHeight = 0
    let trackStartY = 0
    let motionRunning = false

    /**
     * @description Current window scroll offset.
     * @returns {number}
     */
    const getWindowScrollY = () =>
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0

    /**
     * @description Sets track height for window-scroll expansion span.
     * @returns {void}
     */
    const measure = () => {
      const config = configRef.current
      stageHeight = window.innerHeight
      if (stageHeight <= 0) {
        return
      }
      stage.style.height = `${stageHeight}px`
      track.style.height = `${stageHeight * (1 + Math.max(0, config.scrollDistance) + Math.max(0, config.holdDistance))}px`
      trackStartY = track.getBoundingClientRect().top + getWindowScrollY()
    }

    /**
     * @description Normalized expansion progress from window scroll.
     * @returns {number}
     */
    const readProgress = () => {
      const config = configRef.current
      const span = stageHeight * Math.max(0.01, config.scrollDistance)
      return clamp((getWindowScrollY() - trackStartY) / span, 0, 1)
    }

    /**
     * @description RAF loop for optional progress smoothing (Contact `ScrollExpand` pattern).
     * @returns {void}
     */
    const motionTick = () => {
      const config = configRef.current
      const follow =
        config.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * config.smoothing))
      current += (target - current) * follow
      if (Math.abs(target - current) < 0.0004) {
        current = target
        motionRunning = false
      }
      applyProgress(current)
      motionRaf = motionRunning ? requestAnimationFrame(motionTick) : 0
    }

    const kickMotion = () => {
      if (motionRunning) {
        return
      }
      motionRunning = true
      if (!motionRaf) {
        motionRaf = requestAnimationFrame(motionTick)
      }
    }

    const onScroll = () => {
      target = readProgress()
      const config = configRef.current
      if (config.smoothing <= 0 || reduceMotion) {
        current = target
        applyProgress(current)
        return
      }
      kickMotion()
    }

    const syncTick = () => {
      onScroll()
      syncRaf = requestAnimationFrame(syncTick)
    }

    const onResize = () => {
      measure()
      target = readProgress()
      current = target
      applyProgress(current)
    }

    measure()
    target = readProgress()
    current = target

    if (reduceMotion || isTestEnv()) {
      target = 1
      current = 1
    }
    applyProgress(current)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('load', onResize)
    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(root)
    syncRaf = requestAnimationFrame(syncTick)

    return () => {
      if (motionRaf) {
        cancelAnimationFrame(motionRaf)
      }
      if (syncRaf) {
        cancelAnimationFrame(syncRaf)
      }
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', onResize)
      resizeObserver.disconnect()
    }
  }, [applyProgress])

  return (
    <div
      ref={rootRef}
      className={cn(
        'scroll-expansion-hero scroll-expansion-hero--window',
        className,
      )}
    >
      <div ref={trackRef} className="scroll-expansion-hero__track">
        <section
          ref={stageRef}
          aria-label={ariaLabel}
          className="scroll-expansion-hero__stage"
        >
          <div ref={bgRef} className="scroll-expansion-hero__bg">
            <img src={bgImageSrc} alt="" fetchPriority="high" />
            <div className="absolute inset-0 bg-[#0c0d10]/40" aria-hidden />
          </div>

          <div className="scroll-expansion-hero__inner">
            <div ref={boxRef} className="scroll-expansion-hero__box">
              {mediaType === 'video' ? (
                <video
                  ref={mediaRef as React.RefObject<HTMLVideoElement>}
                  src={mediaSrc}
                  poster={posterSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="scroll-expansion-hero__media"
                />
              ) : (
                <img
                  ref={mediaRef as React.RefObject<HTMLImageElement>}
                  src={mediaSrc}
                  alt={title || 'Hero media'}
                  className="scroll-expansion-hero__media"
                  draggable={false}
                />
              )}
              <div ref={scrimRef} className="scroll-expansion-hero__scrim" />
              {children ? (
                <div ref={overlayRef} className="scroll-expansion-hero__overlay">
                  {children}
                </div>
              ) : null}
              {(date || scrollToExpand) && (
                <div className="scroll-expansion-hero__meta">
                  {date ? (
                    <p
                      ref={dateRef}
                      className="font-display text-lg tracking-[0.18em] text-primary uppercase sm:text-xl"
                    >
                      {date}
                    </p>
                  ) : null}
                  {scrollToExpand ? (
                    <p
                      ref={hintRef}
                      className="text-ui font-medium text-white/85"
                    >
                      {scrollToExpand}
                    </p>
                  ) : null}
                </div>
              )}
            </div>

            {title ? (
              <div
                className={cn(
                  'scroll-expansion-hero__titles',
                  textBlend ? 'mix-blend-difference' : 'mix-blend-normal',
                )}
              >
                <h2
                  ref={titleFirstRef}
                  className="scroll-expansion-hero__title-line text-white"
                >
                  {firstWord}
                </h2>
                <h2
                  ref={titleRestRef}
                  className="scroll-expansion-hero__title-line text-primary"
                >
                  {restOfTitle}
                </h2>
              </div>
            ) : null}

          </div>
        </section>
      </div>
    </div>
  )
}

export default ScrollExpandMedia
