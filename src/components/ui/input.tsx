import type { InputHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

/**
 * @description Styled text input aligned with Repairex form surfaces and elevated contrast.
 * @param {InputProps} props - Native input props and className.
 * @returns {JSX.Element} Input element.
 */
export function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full rounded-xl border border-border bg-card px-3.5 text-body text-foreground shadow-xs outline-none transition placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  )
}
