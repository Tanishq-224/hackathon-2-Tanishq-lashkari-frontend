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

import { cn } from '@/lib/utils'

export type AppSelectOption = {
  value: string
  label: string
}

type MenuPosition = {
  top: number
  left: number
  width: number
}

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

export type AppSelectProps = {
  id?: string
  value: string
  options: AppSelectOption[]
  onChange: (value: string) => void
  onBlur?: () => void
  invalid?: boolean
  placeholder?: string
  /** Accessible name when no visible label is wired with htmlFor */
  ariaLabel?: string
  className?: string
  triggerClassName?: string
  /** Compact height for filter bars */
  size?: 'default' | 'sm'
}

/**
 * @description Custom listbox select — matches Repairex form fields (no native OS dropdown).
 */
export function AppSelect({
  id: idProp,
  value,
  options,
  onChange,
  onBlur,
  invalid,
  placeholder = 'Select…',
  ariaLabel,
  className,
  triggerClassName,
  size = 'default',
}: AppSelectProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const listboxId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const menuPosition = useMenuPosition(open, triggerRef)

  const selectedLabel = options.find((item) => item.value === value)?.label ?? placeholder

  const closeMenu = useCallback(() => {
    setOpen(false)
    onBlur?.()
  }, [onBlur])

  useEffect(() => {
    if (!open) {
      return undefined
    }

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

  function selectOption(next: string) {
    onChange(next)
    setOpen(false)
    onBlur?.()
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
              'fixed z-[200] max-h-[min(16rem,70vh)] overflow-y-auto overflow-x-hidden rounded-xl border border-border/80 bg-card p-1.5 shadow-lg',
              'animate-in fade-in-0 zoom-in-95 duration-150',
            )}
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              width: menuPosition.width,
            }}
          >
            {options.map(({ value: itemValue, label }) => {
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
                      selectOption(itemValue)
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
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-invalid={invalid || undefined}
        aria-label={ariaLabel}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-xl border border-border/80 bg-background px-3.5 text-body text-foreground shadow-sm',
          'transition hover:border-primary/35 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20',
          open && 'border-primary ring-2 ring-primary/20',
          invalid && 'border-destructive/60 ring-destructive/15',
          size === 'default' && 'h-11',
          size === 'sm' && 'h-10 min-w-[10.5rem] text-ui',
          triggerClassName,
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
