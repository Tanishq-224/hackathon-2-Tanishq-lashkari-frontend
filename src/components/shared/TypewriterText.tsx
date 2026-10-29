import { useLayoutEffect, useMemo, useState } from 'react'

import { cn } from '@/lib/utils'

type TypewriterPhase = 'typing' | 'deleting'

type UseTypewriterOptions = {
  phrases: readonly string[]
  typingMs?: number
  deletingMs?: number
  holdMs?: number
  enabled?: boolean
}

type UseTypewriterResult = {
  text: string
}

/**
 * @description Cycles phrases with typewriter typing and deleting animation.
 * @param {UseTypewriterOptions} options - Phrases and timing configuration.
 * @returns {UseTypewriterResult} Current visible typewriter text.
 */
function useTypewriter({
  phrases,
  typingMs = 48,
  deletingMs = 28,
  holdMs = 2000,
  enabled = true,
}: UseTypewriterOptions): UseTypewriterResult {
  const safePhrases = useMemo(
    () => phrases.filter((phrase) => phrase.length > 0),
    [phrases],
  )

  const [phraseIndex, setPhraseIndex] = useState(0)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<TypewriterPhase>('typing')

  useLayoutEffect(() => {
    if (!enabled || safePhrases.length === 0) {
      return undefined
    }

    const activePhrase = safePhrases[phraseIndex] ?? safePhrases[0]
    let timeoutId = 0

    if (phase === 'typing') {
      if (text.length < activePhrase.length) {
        timeoutId = window.setTimeout(() => {
          setText(activePhrase.slice(0, text.length + 1))
        }, typingMs)
      } else {
        timeoutId = window.setTimeout(() => setPhase('deleting'), holdMs)
      }

      return () => window.clearTimeout(timeoutId)
    }

    if (text.length > 0) {
      timeoutId = window.setTimeout(() => {
        setText(activePhrase.slice(0, text.length - 1))
      }, deletingMs)
      return () => window.clearTimeout(timeoutId)
    }

    timeoutId = window.setTimeout(() => {
      setPhraseIndex((current) => (current + 1) % safePhrases.length)
      setPhase('typing')
    }, deletingMs)

    return () => window.clearTimeout(timeoutId)
  }, [
    deletingMs,
    enabled,
    holdMs,
    phase,
    phraseIndex,
    safePhrases,
    text,
    typingMs,
  ])

  if (!enabled || safePhrases.length === 0) {
    return { text: safePhrases[0] ?? '' }
  }

  return { text }
}

type TypewriterTextProps = {
  phrases: readonly string[]
  className?: string
  cursorClassName?: string
  typingMs?: number
  deletingMs?: number
  holdMs?: number
}

/**
 * @description Block-friendly typewriter for a dedicated headline line.
 * @param {TypewriterTextProps} props - Phrases, styling, and timing overrides.
 * @returns {JSX.Element} Live region with animated typewriter output.
 */
export function TypewriterText({
  phrases,
  className,
  cursorClassName,
  typingMs,
  deletingMs,
  holdMs,
}: TypewriterTextProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)

  const longestPhrase = useMemo(
    () =>
      phrases.reduce(
        (longest, phrase) => (phrase.length > longest.length ? phrase : longest),
        '',
      ),
    [phrases],
  )

  const { text } = useTypewriter({
    phrases,
    typingMs,
    deletingMs,
    holdMs,
    enabled: !prefersReducedMotion,
  })

  const visibleText = prefersReducedMotion ? (phrases[0] ?? '') : text

  return (
    <span className={cn('relative inline-block min-h-[1.1em]', className)}>
      <span aria-hidden className="invisible whitespace-nowrap">
        {longestPhrase}
      </span>
      <span
        aria-live="polite"
        aria-atomic="true"
        className="absolute inset-x-0 top-0 whitespace-nowrap"
      >
        {visibleText}
        {!prefersReducedMotion ? (
          <span
            aria-hidden
            className={cn(
              'typewriter-cursor ml-px inline-block h-[0.85em] w-[2px] translate-y-[0.06em] bg-current align-middle',
              cursorClassName,
            )}
          />
        ) : null}
      </span>
    </span>
  )
}
