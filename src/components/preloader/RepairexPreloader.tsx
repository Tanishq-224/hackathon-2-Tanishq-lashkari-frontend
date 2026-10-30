import gsap from 'gsap'
import { useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import {
  markPageRevealSessionComplete,
  PAGE_REVEAL_CONFIG,
  type PageRevealConfig,
} from '@/components/reveal/page-reveal-config'
import { setLenisScrollLocked } from '@/lib/lenis-control'

import {
  getPreloaderPanelCount,
  getPreloaderPanelExitOrder,
  type PreloaderPanelCount,
} from '@/components/preloader/preloader-panels'

import './repairex-preloader.css'

type RepairexPreloaderProps = {
  onComplete: () => void
  config?: PageRevealConfig
}

type BodyScrollSnapshot = {
  overflow: string
  paddingRight: string
}

const PANEL_TONES = ['1', '2', '3', '4'] as const

/** Tuned for ~3.5s total (4 words + 4 panel exit on desktop). */
const PRELOADER_TIMING = {
  textFadeIn: 0.85,
  wordScrollDuration: 0.48,
  wordScrollFirstOverlap: 0.72,
  wordScrollGap: 0.12,
  pauseBeforeExit: 0.15,
  textFadeOut: 0.3,
  panelDuration: 0.4,
  panelStagger: 0.07,
  rootFadeOut: 0.1,
  rootFadeOverlap: 0.06,
} as const

let bodySnapshot: BodyScrollSnapshot | null = null

const preloaderRuntime = {
  generation: 0,
  deferredTeardown: 0 as ReturnType<typeof setTimeout> | 0,
  activeContext: null as gsap.Context | null,
}

if (
  typeof window !== 'undefined' &&
  !(window as Window & { __repairexPreloaderRuntimeListener?: boolean })
    .__repairexPreloaderRuntimeListener
) {
  ;(
    window as Window & { __repairexPreloaderRuntimeListener?: boolean }
  ).__repairexPreloaderRuntimeListener = true
  window.addEventListener('repairex:page-reveal-reset-runtime', () => {
    preloaderRuntime.activeContext?.revert()
    preloaderRuntime.activeContext = null
    if (preloaderRuntime.deferredTeardown) {
      window.clearTimeout(preloaderRuntime.deferredTeardown)
      preloaderRuntime.deferredTeardown = 0
    }
  })
}

/**
 * @description Locks document scroll while the preloader is visible.
 * @returns {void}
 */
function lockDocumentScroll(): void {
  if (typeof document === 'undefined') {
    return
  }
  const body = document.body
  bodySnapshot = {
    overflow: body.style.overflow,
    paddingRight: body.style.paddingRight,
  }
  const scrollbarGap = window.innerWidth - document.documentElement.clientWidth
  body.style.overflow = 'hidden'
  if (scrollbarGap > 0) {
    body.style.paddingRight = `${scrollbarGap}px`
  }
  setLenisScrollLocked(true)
}

/**
 * @description Restores scroll after the preloader completes or aborts.
 * @returns {void}
 */
function unlockDocumentScroll(): void {
  if (typeof document === 'undefined') {
    return
  }
  const body = document.body
  if (bodySnapshot) {
    body.style.overflow = bodySnapshot.overflow
    body.style.paddingRight = bodySnapshot.paddingRight
    bodySnapshot = null
  } else {
    body.style.overflow = ''
    body.style.paddingRight = ''
  }
  setLenisScrollLocked(false)
}

/**
 * @description Premium four-panel GSAP preloader with fixed “Digital” + rolling right words.
 * @param {RepairexPreloaderProps} props - Completion callback and optional timing config.
 * @returns {JSX.Element | null}
 */
export function RepairexPreloader({
  onComplete,
  config = PAGE_REVEAL_CONFIG,
}: RepairexPreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const compositionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const runStateRef = useRef({ completed: false })
  const completeRef = useRef(onComplete)
  const panelCountRef = useRef<PreloaderPanelCount>(
    typeof window !== 'undefined'
      ? getPreloaderPanelCount(window.innerWidth)
      : 4,
  )

  completeRef.current = onComplete

  const panelCount = panelCountRef.current
  const visibleTones = PANEL_TONES.slice(0, panelCount)

  useLayoutEffect(() => {
    const expectedPanelCount = panelCountRef.current
    const panelExitOrder = getPreloaderPanelExitOrder(expectedPanelCount)

    runStateRef.current.completed = false

    preloaderRuntime.generation += 1
    const generation = preloaderRuntime.generation
    if (preloaderRuntime.deferredTeardown) {
      window.clearTimeout(preloaderRuntime.deferredTeardown)
      preloaderRuntime.deferredTeardown = 0
    }

    if (preloaderRuntime.activeContext) {
      preloaderRuntime.activeContext.revert()
      preloaderRuntime.activeContext = null
    }

    let fallbackTimer = 0
    let ctx: gsap.Context | null = null
    let rafId = 0
    let layoutAttempts = 0

    /**
     * @description Finishes preloader: unlock scroll, persist session, unmount overlay.
     * @returns {void}
     */
    const finish = () => {
      if (generation !== preloaderRuntime.generation) {
        return
      }
      if (runStateRef.current.completed) {
        return
      }
      runStateRef.current.completed = true
      preloaderRuntime.activeContext = null
      unlockDocumentScroll()
      markPageRevealSessionComplete(config)

      const root = rootRef.current
      if (root) {
        root.style.opacity = '0'
        root.style.visibility = 'hidden'
        root.style.pointerEvents = 'none'
      }
      window.requestAnimationFrame(() => {
        if (generation !== preloaderRuntime.generation) {
          return
        }
        completeRef.current()
      })
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    /**
     * @description Resolves DOM nodes required to run the GSAP timeline.
     * @returns {{ root, composition, track, panels, wordCount, wordStep } | null}
     */
    const resolveLayout = () => {
      const root = rootRef.current
      const composition = compositionRef.current
      const track = trackRef.current
      if (!root || !composition || !track) {
        return null
      }

      const panels = Array.from(
        root.querySelectorAll<HTMLDivElement>('.repairex-preloader__panel'),
      )
      if (panels.length !== expectedPanelCount) {
        return null
      }

      const wordSlot = track.parentElement as HTMLElement | null
      const firstWord = track.querySelector<HTMLElement>(
        '.repairex-preloader__word',
      )
      const slotHeight = wordSlot?.getBoundingClientRect().height ?? 0
      const wordHeight = firstWord?.getBoundingClientRect().height ?? 0
      let wordStep = Math.max(slotHeight, wordHeight)
      if (wordStep <= 0) {
        const fontSize = parseFloat(
          getComputedStyle(wordSlot ?? track).fontSize || '0',
        )
        wordStep = fontSize > 0 ? fontSize * 1.15 : 0
      }

      const wordCount = Math.max(
        1,
        track.querySelectorAll('.repairex-preloader__word').length,
      )

      return { root, composition, track, panels, wordCount, wordStep }
    }

    /**
     * @description Builds GSAP timeline once layout metrics for the word track exist.
     * @param {NonNullable<ReturnType<typeof resolveLayout>>} layout - Measured DOM snapshot.
     * @returns {void}
     */
    const runTimeline = (
      layout: NonNullable<ReturnType<typeof resolveLayout>>,
    ) => {
      const { root, composition, track, panels, wordCount, wordStep } = layout
      const step = wordStep > 0 ? wordStep : 48

      try {
        ctx = gsap.context(() => {
          gsap.set(root, { opacity: 1 })
          gsap.set(composition, { opacity: 0 })
          gsap.set(track, { y: step, force3D: true })
          panels.forEach((panel) => {
            gsap.set(panel, { yPercent: 0, force3D: true })
          })

          const tl = gsap.timeline({
            defaults: { ease: 'power3.inOut' },
            onComplete: finish,
          })

          tl.to(composition, {
            opacity: 1,
            duration: PRELOADER_TIMING.textFadeIn,
            ease: 'sine.out',
          })

          for (let index = 0; index < wordCount; index += 1) {
            const targetY = -step * index
            tl.to(
              track,
              {
                y: targetY,
                duration: PRELOADER_TIMING.wordScrollDuration,
                ease: index === 0 ? 'power3.out' : 'power3.inOut',
              },
              index === 0
                ? `-=${PRELOADER_TIMING.wordScrollFirstOverlap}`
                : `+=${PRELOADER_TIMING.wordScrollGap}`,
            )
          }

          tl.to({}, { duration: PRELOADER_TIMING.pauseBeforeExit })

          tl.to(composition, {
            opacity: 0,
            duration: PRELOADER_TIMING.textFadeOut,
            ease: 'sine.inOut',
          })

          tl.addLabel('panelExit')
          panelExitOrder.forEach((panelIndex, sequenceIndex) => {
            const panel = panels[panelIndex]
            if (!panel) {
              return
            }
            tl.to(
              panel,
              {
                yPercent: -100,
                duration: PRELOADER_TIMING.panelDuration,
                ease: 'power4.inOut',
              },
              sequenceIndex === 0
                ? 'panelExit'
                : `panelExit+=${PRELOADER_TIMING.panelStagger * sequenceIndex}`,
            )
          })

          tl.to(
            root,
            {
              opacity: 0,
              duration: PRELOADER_TIMING.rootFadeOut,
              ease: 'power1.out',
            },
            `-=${PRELOADER_TIMING.rootFadeOverlap}`,
          )

          tl.set(root, { visibility: 'hidden', pointerEvents: 'none' })
        }, root)

        preloaderRuntime.activeContext = ctx
        window.clearTimeout(fallbackTimer)
      } catch {
        finish()
      }
    }

    /**
     * @description Waits for portal DOM + fonts before starting GSAP.
     * @returns {void}
     */
    const tryStartTimeline = () => {
      if (generation !== preloaderRuntime.generation) {
        return
      }

      const layout = resolveLayout()
      layoutAttempts += 1

      if (!layout && layoutAttempts < 24) {
        rafId = window.requestAnimationFrame(tryStartTimeline)
        return
      }

      if (!layout) {
        finish()
        return
      }

      if (prefersReducedMotion) {
        lockDocumentScroll()
        gsap.to(layout.root, {
          opacity: 0,
          duration: config.reducedMotionFadeMs / 1000,
          onComplete: finish,
        })
        return
      }

      lockDocumentScroll()
      runTimeline(layout)
    }

    fallbackTimer = window.setTimeout(finish, config.fallbackTimeoutMs)
    rafId = window.requestAnimationFrame(tryStartTimeline)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.clearTimeout(fallbackTimer)
      if (runStateRef.current.completed) {
        return
      }
      preloaderRuntime.deferredTeardown = window.setTimeout(() => {
        if (generation !== preloaderRuntime.generation) {
          return
        }
        ctx?.revert()
        if (preloaderRuntime.activeContext === ctx) {
          preloaderRuntime.activeContext = null
        }
        unlockDocumentScroll()
      }, 0)
    }
  }, [config])

  const words =
    config.words.length > 0
      ? config.words
      : ['Repairs', 'Care', 'Trust', 'Experience']

  const overlay = (
    <div
      ref={rootRef}
      className="repairex-preloader fixed inset-0 z-[9999] h-dvh w-full overflow-hidden"
      aria-hidden="true"
      aria-busy="true"
    >
      <div className="repairex-preloader__text-layer fixed inset-0 z-[2] flex items-center justify-center px-3">
        <div
          ref={compositionRef}
          className="repairex-preloader__composition"
        >
          <span className="repairex-preloader__digital">Digital</span>
          <div className="repairex-preloader__word-slot">
            <div ref={trackRef} className="repairex-preloader__word-track">
              {words.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className="repairex-preloader__word"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`repairex-preloader__panels repairex-preloader__panels--${panelCount} absolute inset-0 z-[1]`}
      >
        {visibleTones.map((tone, index) => (
          <div key={tone} className="repairex-preloader__panel-shell">
            <div
              ref={(node) => {
                panelRefs.current[index] = node
              }}
              className="repairex-preloader__panel"
              data-tone={tone}
            />
          </div>
        ))}
      </div>
    </div>
  )

  if (typeof document === 'undefined') {
    return overlay
  }

  return createPortal(overlay, document.body)
}
