import { Wrench } from 'lucide-react'

import { cn } from '@/lib/utils'

type RepairexBrandMarkProps = {
  className?: string
}

/**
 * @description Circular Repairex logo mark with a tilted wrench for the public header.
 * @param {RepairexBrandMarkProps} props - Optional wrapper class names.
 * @returns {JSX.Element} Brand icon badge.
 */
export function RepairexBrandMark({ className }: RepairexBrandMarkProps) {
  return (
    <span
      className={cn(
        'relative flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_4px_14px_-4px] shadow-primary/55 ring-1 ring-primary-foreground/15',
        className,
      )}
      aria-hidden
    >
      <span className="absolute inset-0 rounded-full bg-linear-to-br from-white/25 via-transparent to-black/10" />
      <Wrench
        className="relative size-[1.05rem] -rotate-[38deg]"
        strokeWidth={2.35}
      />
    </span>
  )
}
