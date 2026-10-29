import { ArrowUpRight } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

import { useGsapAccordionPanel } from '@/hooks/useGsapAccordionPanel'
import { cn } from '@/lib/utils'

export type MarketingFaqItem = {
  id: string
  question: string
  answer: string
}

type MarketingFaqAccordionProps = {
  items: readonly MarketingFaqItem[]
  defaultOpenId?: string
  className?: string
}

type FaqAccordionRowProps = {
  item: MarketingFaqItem
  open: boolean
  reducedMotion: boolean
  onToggle: (id: string) => void
}

/**
 * @description Single FAQ row with circular arrow trigger and GSAP panel motion.
 * @param {FaqAccordionRowProps} props - Item data, open state, and toggle handler.
 * @returns {JSX.Element} FAQ accordion row.
 */
function FaqAccordionRow({
  item,
  open,
  reducedMotion,
  onToggle,
}: FaqAccordionRowProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  useGsapAccordionPanel(panelRef, innerRef, { open, reducedMotion })

  return (
    <div className="border-b border-border/70 first:border-t">
      <button
        type="button"
        id={`${panelId}-trigger`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onToggle(item.id)}
        className="group flex w-full items-center justify-between gap-6 py-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:gap-8 sm:py-7"
      >
        <span className="font-display text-[clamp(1.05rem,2.1vw,1.35rem)] font-medium leading-snug tracking-tight text-foreground">
          {item.question}
        </span>
        <span
          aria-hidden
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 ease-out',
            open && 'rotate-90',
          )}
        >
          <ArrowUpRight className="size-[1.125rem]" strokeWidth={2.25} />
        </span>
      </button>

      <div
        id={panelId}
        ref={panelRef}
        role="region"
        aria-labelledby={`${panelId}-trigger`}
        hidden={!open && reducedMotion}
        className="overflow-hidden"
      >
        <div ref={innerRef} className="pb-7 pr-2 text-body leading-relaxed text-muted-foreground sm:pr-14">
          {item.answer}
        </div>
      </div>
    </div>
  )
}

/**
 * @description Reference-style FAQ accordion with one open item and smooth GSAP panels.
 * @param {MarketingFaqAccordionProps} props - FAQ entries and optional default open id.
 * @returns {JSX.Element} Marketing FAQ accordion list.
 */
export function MarketingFaqAccordion({
  items,
  defaultOpenId,
  className,
}: MarketingFaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(
    defaultOpenId ?? items[0]?.id ?? null,
  )
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    /**
     * @description Syncs reduced-motion preference into React state.
     * @returns {void}
     */
    const syncMotion = () => setReducedMotion(media.matches)
    syncMotion()
    media.addEventListener('change', syncMotion)
    return () => media.removeEventListener('change', syncMotion)
  }, [])

  /**
   * @description Toggles the active FAQ row (collapses when the same row is clicked).
   * @param {string} id - FAQ item id.
   * @returns {void}
   */
  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id))
  }

  return (
    <div className={cn('w-full min-w-0', className)}>
      {items.map((item) => (
        <FaqAccordionRow
          key={item.id}
          item={item}
          open={openId === item.id}
          reducedMotion={reducedMotion}
          onToggle={handleToggle}
        />
      ))}
    </div>
  )
}
