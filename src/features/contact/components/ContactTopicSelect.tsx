import { Check, ChevronDown } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'

import {
  CONTACT_FORM_PLATFORM_TOPICS,
  type ContactPlatformTopic,
} from '@/features/contact/lib/contact-form-schema'
import { cn } from '@/lib/utils'

type ContactTopicSelectProps = {
  id: string
  value: ContactPlatformTopic
  invalid?: boolean
  onChange: (value: ContactPlatformTopic) => void
  onBlur: () => void
}

type MenuPosition = {
  top: number
  left: number
  width: number
}

/**
 * @description Keeps the topic menu anchored under the trigger while scrolling.
 */
function useMenuPosition(open: boolean, anchorRef: RefObject<HTMLElement | null>) {
  const [position, setPosition] = useState<MenuPosition | null>(null)

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current
    if (!anchor) {
      return
    }

    const rect = anchor.getBoundingClientRect()
    setPosition({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    })
  }, [anchorRef])

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null)
      return undefined
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, updatePosition])

  return position
}

/**
 * @description Custom topic menu — matches contact form fields, opens below the trigger.
 */
export function ContactTopicSelect({
  id,
  value,
  invalid,
  onChange,
  onBlur,
}: ContactTopicSelectProps) {
  const listboxId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const menuPosition = useMenuPosition(open, triggerRef)

  const selectedLabel =
    CONTACT_FORM_PLATFORM_TOPICS.find((item) => item.value === value)?.label ??
    'Choose a topic'

  const closeMenu = useCallback(() => {
    setOpen(false)
    onBlur()
  }, [onBlur])

  useEffect(() => {
    if (!open) {
      return undefined
    }

    /**
     * @description Closes the menu on outside click or Escape.
     */
    function handlePointerDown(event: MouseEvent) {
      const target = event.target
      if (!(target instanceof Node)) {
        return
      }
      if (rootRef.current?.contains(target)) {
        return
      }
      closeMenu()
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeMenu()
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, closeMenu])

  function selectTopic(next: ContactPlatformTopic) {
    onChange(next)
    setOpen(false)
    onBlur()
    triggerRef.current?.focus()
  }

  const menu =
    open && menuPosition
      ? createPortal(
          <ul
            id={listboxId}
            role="listbox"
            aria-labelledby={id}
            className={cn(
              'fixed z-[200] overflow-hidden rounded-xl border border-border/80 bg-card p-1.5 shadow-lg',
              'animate-in fade-in-0 zoom-in-95 duration-150',
            )}
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              width: menuPosition.width,
            }}
          >
            {CONTACT_FORM_PLATFORM_TOPICS.map(({ value: itemValue, label }) => {
              const isSelected = itemValue === value

              return (
                <li key={itemValue} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-ui transition-colors',
                      'text-foreground hover:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25',
                      isSelected && 'bg-primary/10 font-medium text-foreground',
                    )}
                    onClick={() => {
                      selectTopic(itemValue)
                    }}
                  >
                    <span
                      className={cn(
                        'flex size-4 shrink-0 items-center justify-center rounded-full border border-border/80',
                        isSelected && 'border-primary bg-primary text-primary-foreground',
                      )}
                      aria-hidden
                    >
                      {isSelected ? <Check className="size-2.5 stroke-[3]" /> : null}
                    </span>
                    <span>{label}</span>
                  </button>
                </li>
              )
            })}
          </ul>,
          document.body,
        )
      : null

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-invalid={invalid || undefined}
        className={cn(
          'flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-border/80 bg-background px-3.5 text-body text-foreground shadow-sm',
          'transition hover:border-border focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20',
          open && 'border-primary ring-2 ring-primary/20',
          invalid && 'border-destructive/60 ring-destructive/15',
        )}
        onClick={() => {
          setOpen((wasOpen) => !wasOpen)
        }}
      >
        <span className="truncate text-left">{selectedLabel}</span>
        <ChevronDown
          aria-hidden
          className={cn(
            'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
      {menu}
    </div>
  )
}
