import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRound, Loader2, Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  forgotPasswordRequest,
  resetPasswordRequest,
  resendOtpRequest,
} from '@/features/auth/api/authApi'
import { PasswordField } from '@/features/auth/components/PasswordField'
import { PasswordStrengthBar } from '@/features/auth/components/PasswordStrengthBar'
import {
  profilePasswordResetSchema,
  type ProfilePasswordResetFormValues,
} from '@/features/auth/lib/auth-schemas'
import { useAppToast } from '@/components/shared/AppToastProvider'
import { getApiErrorMessage } from '@/lib/api-client'
import { cn } from '@/lib/utils'

type ProfilePasswordResetSectionProps = {
  email: string
}

/**
 * @description In-dashboard password change using email OTP (same flow as forgot password).
 */
export function ProfilePasswordResetSection({ email }: ProfilePasswordResetSectionProps) {
  const { pushError, pushSuccess } = useAppToast()
  const [codeSent, setCodeSent] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfilePasswordResetFormValues>({
    resolver: zodResolver(profilePasswordResetSchema),
    defaultValues: { otp: '', password: '', confirmPassword: '' },
  })

  const passwordValue = watch('password')

  async function sendVerificationCode() {
    setSendingCode(true)
    try {
      const response = await forgotPasswordRequest(email)
      setCodeSent(true)
      pushSuccess(response.message || 'Verification code sent to your email.')
    } catch (error) {
      pushError(getApiErrorMessage(error))
    } finally {
      setSendingCode(false)
    }
  }

  async function handleResendCode() {
    try {
      const response = await resendOtpRequest({ email, purpose: 'reset' })
      pushSuccess(response.message || 'A new code was sent.')
    } catch (error) {
      pushError(getApiErrorMessage(error))
    }
  }

  async function onSubmit(values: ProfilePasswordResetFormValues) {
    try {
      const response = await resetPasswordRequest({
        email,
        otp: values.otp,
        password: values.password,
        confirmPassword: values.confirmPassword,
      })
      pushSuccess(response.message || 'Password updated successfully.')
      reset({ otp: '', password: '', confirmPassword: '' })
      setCodeSent(false)
    } catch (error) {
      pushError(getApiErrorMessage(error))
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2 text-foreground">
        <KeyRound className="h-5 w-5 text-primary" />
        <h2 className="font-display text-h3 font-semibold">Password & security</h2>
      </div>
      <p className="mt-1 text-ui text-muted-foreground">
        We email a 6-digit code to verify it&apos;s you before setting a new password.
      </p>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-ui text-muted-foreground">
        <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        <span className="truncate">{email}</span>
      </div>

      {!codeSent ? (
        <Button
          type="button"
          variant="outline"
          className="mt-5 gap-2"
          disabled={sendingCode}
          onClick={() => {
            void sendVerificationCode()
          }}
        >
          {sendingCode ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
          Send verification code
        </Button>
      ) : (
        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            void handleSubmit(onSubmit)(e)
          }}
        >
          <div className="rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 text-caption text-foreground">
            Check your inbox for the code. It expires after a few minutes.
          </div>

          <label className="block text-ui font-medium text-foreground">
            Verification code
            <Input
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="6-digit code"
              className={cn('mt-1.5 font-mono tracking-widest', errors.otp && 'border-destructive')}
              {...register('otp')}
            />
            {errors.otp ? (
              <p className="mt-1 text-caption text-destructive">{errors.otp.message}</p>
            ) : null}
          </label>

          <div className="space-y-1.5">
            <label htmlFor="profile-new-password" className="text-ui font-medium text-foreground">
              New password
            </label>
            <PasswordField
              id="profile-new-password"
              autoComplete="new-password"
              placeholder="••••••••"
              error={errors.password?.message}
              registration={register('password')}
              strengthSlot={<PasswordStrengthBar password={passwordValue} />}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="profile-confirm-password" className="text-ui font-medium text-foreground">
              Confirm new password
            </label>
            <PasswordField
              id="profile-confirm-password"
              autoComplete="new-password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              registration={register('confirmPassword')}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Update password
            </Button>
            <button
              type="button"
              className="text-caption font-medium text-primary hover:underline"
              onClick={() => {
                void handleResendCode()
              }}
            >
              Resend code
            </button>
            <button
              type="button"
              className="text-caption text-muted-foreground hover:text-foreground"
              onClick={() => {
                setCodeSent(false)
                reset({ otp: '', password: '', confirmPassword: '' })
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
