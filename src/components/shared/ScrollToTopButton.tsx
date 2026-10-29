import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

type ScrollToTopButtonProps = {
  className?: string
}

/**
 * @description Floating control that returns the visitor to the top of the page.
 * @param {ScrollToTopButtonProps} props - Optional positioning classes.
 * @returns {JSX.Element | null} Scroll-to-top button when scrolled.
 */
export function ScrollToTopButton({ className }: ScrollToTopButtonProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    /**
     * @description Updates button visibility from the current scroll offset.
     * @returns {void}
     */
    const onScroll = () => {
      setVisible(window.scrollY > 420)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /**
   * @description Smoothly scrolls the viewport back to the top.
   * @returns {void}
   */
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  if (!visible) {
    return null
  }

  return (
    <button
      type="button"
      onClick={handleScrollToTop}
      aria-label="Scroll to top"
      className={cn(
        'fixed z-[var(--z-scroll-top)] flex size-11 items-center justify-center rounded-full border border-border/80 bg-background/95 text-foreground shadow-lg backdrop-blur-md transition hover:bg-background hover:text-primary',
        'bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 sm:bottom-6 sm:right-6',
        className,
      )}
    >
      <ArrowUp aria-hidden className="size-5" strokeWidth={2.25} />
    </button>
  )
}
