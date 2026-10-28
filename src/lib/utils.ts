import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * @description Merges Tailwind class names with conflict resolution for shadcn/ui.
 * @param {...ClassValue} inputs - Class name values from props or variants.
 * @returns {string} A single merged class string.
 * @example
 * cn('px-2', condition && 'bg-primary', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
