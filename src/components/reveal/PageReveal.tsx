import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import {
  markPageRevealSessionComplete,
  PAGE_REVEAL_CONFIG,
  type PageRevealConfig,
} from '@/components/reveal/page-reveal-config'
import { setLenisScrollLocked } from '@/lib/lenis-control'

type PageRevealProps = {
  onComplete: () => void
  config?: PageRevealConfig
}

type BodyScrollSnapshot = {
  overflow: string
  paddingRight: string
}

let bodySnapshot: BodyScrollSnapshot | null = null

/** StrictMode / HMR coordination — must not persist "finished" across separate user sessions. */
const revealRuntime = {
  generation: 0,
  deferredTeardown: 0 as ReturnType<typeof setTimeout> | 0,
  activeContext: null as gsap.Context | null,
}

if (typeof window !== 'undefined' && !(window as Window & { __repairexRevealRuntimeListener?: boolean }).__repairexRevealRuntimeListener) {
  ;(window as Window & { __repairexRevealRuntimeListener?: boolean }).__repairexRevealRuntimeListener = true
  window.addEventListener('repairex:page-reveal-reset-runtime', () => {
    revealRuntime.activeContext?.revert()
    revealRuntime.activeContext = null
    if (revealRuntime.deferredTeardown) {
      window.clearTimeout(revealRuntime.deferredTeardown)
      revealRuntime.deferredTeardown = 0
    }
  })
}

/**
 * @description Locks document scroll while overlay is visible.
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
 * @description Restores scroll and Lenis after reveal completes or aborts.
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
 * @description Full-screen word sequence + upward panel reveal (public marketing entry).
 * @param {PageRevealProps} props - Completion callback and optional config overrides.
 * @returns {JSX.Element | null} Fixed overlay while animating.
 */
export function PageReveal({
  onComplete,
  config = PAGE_REVEAL_CONFIG,
}: PageRevealProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const wordsRef = useRef<HTMLDivElement>(null)
  const accentRef = useRef<HTMLDivElement>(null)
  const runStateRef = useRef({ completed: false })
  const completeRef = useRef(onComplete)

  completeRef.current = onComplete

  useLayoutEffect(() => {
    const overlay = overlayRef.current
    const panel = panelRef.current
    const wordsRoot = wordsRef.current

    if (!overlay || !panel || !wordsRoot) {
      return undefined
    }

    revealRuntime.generation += 1
    const generation = revealRuntime.generation
    if (revealRuntime.deferredTeardown) {
      window.clearTimeout(revealRuntime.deferredTeardown)
      revealRuntime.deferredTeardown = 0
    }

    if (runStateRef.current.completed) {
      completeRef.current()
      return undefined
    }

    if (revealRuntime.activeContext) {
      revealRuntime.activeContext.revert()
      revealRuntime.activeContext = null
    }

    const wordEls = Array.from(
      wordsRoot.querySelectorAll<HTMLElement>('[data-reveal-word]'),
    )

    /**
     * @description Finishes reveal: unlock scroll, mark session, unmount overlay.
     * @returns {void}
     */
    const finish = () => {
      if (runStateRef.current.completed) {
        return
      }
      runStateRef.current.completed = true
      revealRuntime.activeContext = null
      unlockDocumentScroll()
      markPageRevealSessionComplete(config)
      gsap.set([overlay, panel, accentRef.current, ...wordEls], {
        clearProps: 'all',
      })
      ScrollTrigger.refresh()
      completeRef.current()
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) {
      lockDocumentScroll()
      gsap.to(overlay, {
        opacity: 0,
        duration: config.reducedMotionFadeMs / 1000,
        onComplete: finish,
      })
      return () => {
        unlockDocumentScroll()
      }
    }

    lockDocumentScroll()

    const perWord = config.totalDurationSec / Math.max(config.words.length, 1)
    const enter = perWord * 0.32
    const hold = perWord * 0.2
    const exit = perWord * 0.28
    const panelReveal = Math.max(0.55, config.totalDurationSec * 0.22)

    let fallbackTimer = 0
    let ctx: gsap.Context | null = null

    try {
      ctx = gsap.context(() => {
        gsap.set(panel, { yPercent: 0 })
        gsap.set(overlay, { opacity: 1, pointerEvents: 'auto' })
        gsap.set(accentRef.current, { scaleX: 0, transformOrigin: 'left center' })

        wordEls.forEach((el) => {
          const inner = el.querySelector<HTMLElement>('[data-reveal-word-inner]')
          if (!inner) return
          gsap.set(inner, { yPercent: 110, opacity: 0 })
        })

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          onComplete: finish,
        })

        tl.to(accentRef.current, {
          scaleX: 1,
          duration: enter,
          ease: 'power2.inOut',
        })

        config.words.forEach((_, index) => {
          const el = wordEls[index]
          if (!el) return
          const inner = el.querySelector<HTMLElement>('[data-reveal-word-inner]')
          if (!inner) return

          tl.to(
            inner,
            {
              yPercent: 0,
              opacity: 1,
              duration: enter,
            },
            index === 0 ? '<0.1' : `+=${hold * 0.35}`,
          )
            .to(
              inner,
              {
                yPercent: -110,
                opacity: 0,
                duration: exit,
                ease: 'power3.in',
              },
              `+=${hold}`,
            )
            .call(
              () => {
                wordEls.forEach((node, i) => {
                  node.dataset.active = i === index ? 'true' : 'false'
                })
              },
              undefined,
              '<',
            )
        })

        tl.to(
          panel,
          {
            yPercent: -100,
            duration: panelReveal,
            ease: 'power4.inOut',
          },
          '-=0.08',
        )
      }, overlay)
      revealRuntime.activeContext = ctx
    } catch {
      finish()
      return undefined
    }

    fallbackTimer = window.setTimeout(finish, config.fallbackTimeoutMs)

    return () => {
      window.clearTimeout(fallbackTimer)
      if (runStateRef.current.completed) {
        return
      }
      revealRuntime.deferredTeardown = window.setTimeout(() => {
        if (generation !== revealRuntime.generation) {
          return
        }
        ctx?.revert()
        if (revealRuntime.activeContext === ctx) {
          revealRuntime.activeContext = null
        }
        unlockDocumentScroll()
      }, 0)
    }
  }, [config])

  const overlay = (
    <div
      ref={overlayRef}
      className="page-reveal-root fixed inset-0 z-[9999] flex min-h-dvh items-center justify-center overflow-hidden bg-graphite text-off-white"
      aria-hidden="true"
    >
      <div
        ref={panelRef}
        className="page-reveal-panel absolute inset-0 flex flex-col items-center justify-center bg-graphite px-6 will-change-transform"
      >
        <div
          ref={accentRef}
          className="mb-8 h-px w-16 max-w-[40vw] bg-primary will-change-transform"
          aria-hidden
        />
        <div
          ref={wordsRef}
          className="relative flex h-[clamp(3rem,12vw,5.5rem)] w-full max-w-[90vw] items-center justify-center"
        >
          {config.words.map((word) => (
            <div
              key={word}
              data-reveal-word
              data-active="false"
              className="page-reveal-word pointer-events-none absolute inset-x-0 flex justify-center overflow-hidden font-display text-[clamp(2.25rem,9vw,4.75rem)] font-bold leading-[1.05] tracking-tight text-off-white/40"
            >
              <span
                data-reveal-word-inner
                className="block translate-y-[110%] opacity-0 will-change-transform"
              >
                {word}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (typeof document === 'undefined') {
    return overlay
  }

  return createPortal(overlay, document.body)
}
