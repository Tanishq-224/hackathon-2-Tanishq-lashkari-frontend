import { Check, Circle } from 'lucide-react'

import { getPasswordStrength } from '@/features/auth/lib/password-strength'
import { cn } from '@/lib/utils'

type PasswordStrengthBarProps = {
  password: string
}

/**
 * @description Visual meter showing password strength and an interactive checklist of alphanumeric requirements with checkmarks on completion.
 * @param {PasswordStrengthBarProps} props - Current password input value.
 * @returns {JSX.Element} Strength bar and interactive rule indicators.
 */
export function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
  const strength = getPasswordStrength(password)
  const segments = 4

  return (
    <div className="space-y-3 pt-1.5">
      {/* Strength Bar & Rating */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-caption font-medium">
          <span className="text-muted-foreground">Password strength:</span>
          <span className={cn('font-semibold transition-colors', strength.colorClass)}>
            {password.length === 0 ? 'Not entered' : strength.label}
          </span>
        </div>

        <div className="flex gap-1.5" aria-hidden>
          {Array.from({ length: segments }).map((_, index) => (
            <span
              key={index}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-all duration-300',
                index < strength.score ? 'bg-primary' : 'bg-muted/80',
              )}
            />
          ))}
        </div>
      </div>

      {/* Alphanumeric Requirements Checklist with Completion Ticks */}
      <div className="grid grid-cols-1 gap-2 rounded-xl border border-border/70 bg-muted/20 p-3 sm:grid-cols-2">
        {strength.rules.map((rule) => {
          const isDone = rule.satisfied
          return (
            <div
              key={rule.id}
              className={cn(
                'flex items-center gap-2 text-caption transition-all duration-200',
                isDone
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground/80',
              )}
            >
              <span
                className={cn(
                  'flex size-4 shrink-0 items-center justify-center rounded-full transition-colors duration-200',
                  isDone
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground/40',
                )}
                aria-hidden
              >
                {isDone ? (
                  <Check className="size-3 stroke-[3]" />
                ) : (
                  <Circle className="size-2.5 fill-current opacity-40" />
                )}
              </span>
              <span className={isDone ? 'text-foreground' : undefined}>
                {rule.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
