import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import loginVisual from '@/assets/login-visual.jpg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { resendOtpRequest, verifySignupOtpRequest } from '@/features/auth/api/authApi'
import { AuthSplitLayout } from '@/features/auth/components/AuthSplitLayout'
import {
  verifyOtpSchema,
  type VerifyOtpFormValues,
} from '@/features/auth/lib/auth-schemas'
import { authSessionQueryKey } from '@/hooks/useAuthSession'
import { getApiErrorMessage } from '@/lib/api-client'
import { cn } from '@/lib/utils'

/**
 * @description Verifies signup email with a 6-digit OTP code.
 * @returns {JSX.Element} OTP verification page.
 */
export function VerifyOtpPage() {
  const [params] = useSearchParams()
  const email = params.get('email') ?? ''
  const purpose = params.get('purpose') === 'reset' ? 'reset' : 'signup'
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [formError, setFormError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otp: '' },
  })

  /**
   * @description Verifies OTP and signs the user in when successful.
   * @async
   * @param {VerifyOtpFormValues} values - OTP digits.
   * @returns {Promise<void>}
   */
  async function onSubmit(values: VerifyOtpFormValues) {
    if (!email) {
      setFormError('Missing email. Start from sign up again.')
      return
    }

    setFormError(null)
    try {
      if (purpose === 'reset') {
        void navigate(
          `/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(values.otp)}`,
        )
        return
      }

      const response = await verifySignupOtpRequest({ email, otp: values.otp })
      setStatus(response.message)
      await queryClient.invalidateQueries({ queryKey: authSessionQueryKey })
      void navigate('/')
    } catch (error) {
      setFormError(getApiErrorMessage(error))
    }
  }

  /**
   * @description Requests another OTP email for the current flow.
   * @async
   * @returns {Promise<void>}
   */
  async function handleResend() {
    if (!email) {
      return
    }
    setFormError(null)
    try {
      const response = await resendOtpRequest({
        email,
        purpose: purpose === 'reset' ? 'reset' : 'signup',
      })
      setStatus(response.message)
    } catch (error) {
      setFormError(getApiErrorMessage(error))
    }
  }

  return (
    <AuthSplitLayout
      title="Verify your email"
      subtitle={
        email
          ? `Enter the 6-digit verification code sent to ${email}. Check your spam folder if you do not see it within a minute.`
          : 'Enter the verification code from your email to activate your account.'
      }
      badge="Verification"
      imageSrc={loginVisual}
      imageAlt="Repairex Account Security"
      quoteTitle="Securing your repair journey."
      quoteDescription="Two-step email verification ensures your device details and quotations remain private and protected."
      highlights={[
        'Fast 6-digit verification',
        'Secure session establishment',
        'Direct dashboard access',
      ]}
      footer={
        <Link to="/signup" className="font-semibold text-primary hover:underline">
          Back to sign up
        </Link>
      }
    >
      <form
        className="space-y-5"
        noValidate
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event)
        }}
      >
        <div className="space-y-1.5">
          <label htmlFor="verify-otp" className="text-ui font-medium text-foreground">
            Verification code <span className="text-destructive">*</span>
          </label>
          <Input
            id="verify-otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            maxLength={6}
            className={cn(
              'h-12 text-center text-h3 tracking-[0.35em] font-mono',
              errors.otp && 'border-destructive focus-visible:ring-destructive/20',
            )}
            {...register('otp')}
          />
          {errors.otp ? (
            <p className="text-caption text-destructive">{errors.otp.message}</p>
          ) : null}
        </div>

        {status ? (
          <p className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-body text-foreground">
            {status}
          </p>
        ) : null}

        {formError ? (
          <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-body text-destructive">
            {formError}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.99]"
        >
          {isSubmitting ? 'Verifying…' : purpose === 'reset' ? 'Continue' : 'Verify & sign in'}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            void handleResend()
          }}
          className="h-11 w-full rounded-xl border-border/80 bg-background hover:bg-muted text-foreground transition-all"
        >
          Resend code
        </Button>
      </form>
    </AuthSplitLayout>
  )
}
