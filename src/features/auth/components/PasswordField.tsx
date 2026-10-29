import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type PasswordFieldProps = {
  id: string
  autoComplete?: string
  placeholder?: string
  error?: string
  inputClassName?: string
  registration: React.ComponentProps<'input'>
  strengthSlot?: React.ReactNode
}

/**
 * @description Password input with reveal/hide toggle and optional strength slot.
 * @param {PasswordFieldProps} props - Field wiring from react-hook-form register spread.
 * @returns {JSX.Element} Password control.
 */
export function PasswordField({
  id,
  autoComplete,
  placeholder,
  error,
  inputClassName,
  registration,
  strengthSlot,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className={cn('pr-11', inputClassName, error && 'border-destructive')}
          {...registration}
        />
        <button
          type="button"
          onClick={() => {
            setVisible((prev) => !prev)
          }}
          className="absolute top-1/2 right-2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? (
            <EyeOff aria-hidden className="size-[1.125rem]" />
          ) : (
            <Eye aria-hidden className="size-[1.125rem]" />
          )}
        </button>
      </div>
      {strengthSlot}
      {error ? (
        <p className="text-caption text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
