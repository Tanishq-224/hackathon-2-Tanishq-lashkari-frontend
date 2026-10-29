import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react'

import './ScrollExpand.css'

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

export type ScrollExpandMediaType = 'image' | 'video'

export type ScrollExpandProps = {
  src?: string
  mediaType?: ScrollExpandMediaType
  poster?: string
  alt?: string
  title?: string
  /** @description Semantic element for the resting headline (contact hero uses h1). */
  titleAs?: 'h1' | 'h2' | 'div'
  scrollHint?: string
  startWidth?: number
  startHeight?: number
  startRadius?: number
  endRadius?: number
  mediaZoom?: number
  scrollDistance?: number
  holdDistance?: number
  smoothing?: number
  overlayScrim?: number
  useWindowScroll?: boolean
  enabled?: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

/**
 * @description Scroll-driven media frame expansion (React Bits ScrollExpand, adapted for Vite + Lenis).
 * @param {ScrollExpandProps} props - Media source, motion tuning, and overlay content.
 * @returns {JSX.Element} Scroll-expand stage.
 */
export function ScrollExpand({
  src = '',
  mediaType = 'image',
  poster = '',
  alt = '',
  title = '',
  titleAs = 'div',
  scrollHint = '',
  startWidth = 42,
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0.1,
  overlayScrim = 0.45,
  useWindowScroll = false,
  enabled = true,
  children,
  className = '',
  style,
  ...rest
}: ScrollExpandProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const titleRef = useRef<HTMLHeadingElement | HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)

  const propsRef = useRef<ScrollExpandProps>({})

  useLayoutEffect(() => {
    propsRef.current = {
      startWidth,
      startHeight,
      startRadius,
      endRadius,
      mediaZoom,
      scrollDistance,
      holdDistance,
      smoothing,
      overlayScrim,
      useWindowScroll,
      enabled,
    }
  }, [
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled,
  ])

  /**
   * @description Applies expansion progress to frame clip-path, media scale, and overlays.
   * @param {number} progress - Normalized progress between 0 and 1.
   * @returns {void}
   */
  const applyProgress = useCallback((progress: number) => {
    const frame = frameRef.current
    const media =
      mediaType === 'video' ? videoRef.current : imageRef.current
    if (!frame || !media) {
      return
    }

    const config = propsRef.current
    const eased = smoothstep(0, 1, progress)

    const width = (config.startWidth ?? 42) + (100 - (config.startWidth ?? 42)) * eased
    const height =
      (config.startHeight ?? 58) + (100 - (config.startHeight ?? 58)) * eased
    const insetX = Math.max(0, (100 - width) / 2)
    const insetY = Math.max(0, (100 - height) / 2)
    const radius =
      (config.startRadius ?? 24) +
      ((config.endRadius ?? 0) - (config.startRadius ?? 24)) * eased

    frame.style.clipPath = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`

    const zoom = config.mediaZoom ?? 1.35
    media.style.transform = `scale(${zoom + (1 - zoom) * eased})`

    if (scrimRef.current) {
      scrimRef.current.style.opacity = `${(config.overlayScrim ?? 0.45) * eased}`
    }

    if (titleRef.current) {
      const titleOut = smoothstep(0.4, 0.88, progress)
      titleRef.current.style.opacity = `${1 - titleOut}`
      titleRef.current.style.transform = `translate3d(0, ${-28 * titleOut}px, 0) scale(${1 + 0.06 * titleOut})`
    }

    if (hintRef.current) {
      const hintGone = smoothstep(0, 0.12, progress)
      hintRef.current.style.opacity = `${1 - hintGone}`
      hintRef.current.style.transform = `translate3d(0, ${8 * hintGone}px, 0)`
    }

    if (overlayRef.current) {
      const overlayIn = smoothstep(0.68, 1, progress)
      overlayRef.current.style.opacity = `${overlayIn}`
      overlayRef.current.style.transform = `translate3d(0, ${18 * (1 - overlayIn)}px, 0)`
    }
  }, [mediaType])

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
     * @description Returns the current vertical scroll offset for window scroll mode.
     * @returns {number} Scroll position in pixels.
     */
    const getWindowScrollY = () =>
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0

    /**
     * @description Measures stage height and sets track scroll span.
     * @returns {void}
     */
    const measure = () => {
      const config = propsRef.current
      stageHeight = config.useWindowScroll ? window.innerHeight : root.clientHeight
      if (stageHeight <= 0) {
        return
      }
      stage.style.height = `${stageHeight}px`
      track.style.height = `${stageHeight * (1 + Math.max(0, config.scrollDistance ?? 1.2) + Math.max(0, config.holdDistance ?? 0.35))}px`

      if (config.useWindowScroll) {
        trackStartY = track.getBoundingClientRect().top + getWindowScrollY()
      }

      const width = root.clientWidth || stageHeight
      stage.style.setProperty(
        '--se-title-size',
        `${clamp(width * 0.075, 20, 84)}px`,
      )
    }

    /**
     * @description Reads normalized scroll progress for window or internal scroller.
     * @returns {number} Progress from 0 to 1.
     */
    const readProgress = () => {
      const config = propsRef.current
      if (!config.enabled) {
        return 1
      }
      const span = stageHeight * Math.max(0.01, config.scrollDistance ?? 1.2)
      if (config.useWindowScroll) {
        return clamp((getWindowScrollY() - trackStartY) / span, 0, 1)
      }
      return clamp(root.scrollTop / span, 0, 1)
    }

    /**
     * @description Animation frame loop for smoothed progress follow.
     * @returns {void}
     */
    const motionTick = () => {
      const config = propsRef.current
      const follow =
        (config.smoothing ?? 0.1) <= 0
          ? 1
          : 1 - Math.exp(-1 / (60 * (config.smoothing ?? 0.1)))
      current += (target - current) * follow
      if (Math.abs(target - current) < 0.0004) {
        current = target
        motionRunning = false
      }
      applyProgress(current)
      motionRaf = motionRunning ? requestAnimationFrame(motionTick) : 0
    }

    /**
     * @description Starts smoothed follow loop when needed.
     * @returns {void}
     */
    const kickMotion = () => {
      if (motionRunning) {
        return
      }
      motionRunning = true
      if (!motionRaf) {
        motionRaf = requestAnimationFrame(motionTick)
      }
    }

    /**
     * @description Handles scroll / Lenis sync by updating target progress.
     * @returns {void}
     */
    const onScroll = () => {
      target = readProgress()
      const config = propsRef.current
      if ((config.smoothing ?? 0.1) <= 0 || reduceMotion) {
        current = target
        applyProgress(current)
        return
      }
      kickMotion()
    }

    /**
     * @description Keeps progress in sync every frame (Lenis does not always emit native scroll).
     * @returns {void}
     */
    const syncTick = () => {
      onScroll()
      syncRaf = requestAnimationFrame(syncTick)
    }

    /**
     * @description Re-measures layout and snaps progress after resize.
     * @returns {void}
     */
    const onResize = () => {
      measure()
      target = readProgress()
      current = target
      applyProgress(current)
    }

    measure()
    target = readProgress()
    current = target
    if (reduceMotion) {
      target = 1
      current = 1
    }
    applyProgress(current)

    const scroller = useWindowScroll ? window : root
    scroller.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('load', onResize)
    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(root)

    if (useWindowScroll) {
      syncRaf = requestAnimationFrame(syncTick)
    }

    return () => {
      if (motionRaf) {
        cancelAnimationFrame(motionRaf)
      }
      if (syncRaf) {
        cancelAnimationFrame(syncRaf)
      }
      scroller.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', onResize)
      resizeObserver.disconnect()
    }
  }, [applyProgress, useWindowScroll])

  const media =
    mediaType === 'video' ? (
      <video
        ref={videoRef}
        className="scroll-expand__media"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
      />
    ) : (
      <img
        ref={imageRef}
        className="scroll-expand__media"
        src={src}
        alt={alt}
        draggable={false}
      />
    )

  return (
    <div
      ref={rootRef}
      className={`scroll-expand ${useWindowScroll ? 'scroll-expand--window' : 'scroll-expand--scroller'} ${className}`.trim()}
      style={style}
      {...rest}
    >
      <div ref={trackRef} className="scroll-expand__track">
        <div ref={stageRef} className="scroll-expand__stage">
          <div ref={frameRef} className="scroll-expand__frame">
            {media}
            <div ref={scrimRef} className="scroll-expand__scrim" />
            {children ? (
              <div ref={overlayRef} className="scroll-expand__overlay">
                {children}
              </div>
            ) : null}
          </div>
          {title && titleAs === 'h1' ? (
            <h1 ref={titleRef} className="scroll-expand__title">
              {title}
            </h1>
          ) : null}
          {title && titleAs === 'h2' ? (
            <h2 ref={titleRef} className="scroll-expand__title">
              {title}
            </h2>
          ) : null}
          {title && titleAs === 'div' ? (
            <div ref={titleRef} className="scroll-expand__title">
              {title}
            </div>
          ) : null}
          {scrollHint ? (
            <div ref={hintRef} className="scroll-expand__hint">
              {scrollHint}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
