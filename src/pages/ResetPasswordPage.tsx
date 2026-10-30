import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import loginVisual from '@/assets/login-visual.jpg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { resetPasswordRequest, resendOtpRequest } from '@/features/auth/api/authApi'
import { AuthSplitLayout } from '@/features/auth/components/AuthSplitLayout'
import { PasswordField } from '@/features/auth/components/PasswordField'
import { PasswordStrengthBar } from '@/features/auth/components/PasswordStrengthBar'
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/features/auth/lib/auth-schemas'
import { useAppToast } from '@/components/shared/AppToastProvider'
import { getApiErrorMessage } from '@/lib/api-client'
import { cn } from '@/lib/utils'

/**
 * @description Sets a new password using the emailed reset OTP.
 * @returns {JSX.Element} Reset password page.
 */
export function ResetPasswordPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const emailFromQuery = params.get('email') ?? ''
  const otpFromQuery = params.get('otp') ?? ''

  const { pushError, pushSuccess } = useAppToast()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailFromQuery,
      otp: otpFromQuery,
      password: '',
      confirmPassword: '',
    },
  })

  const passwordValue = watch('password')

  /**
   * @description Submits OTP + new password to the API.
   * @async
   * @param {ResetPasswordFormValues} values - Reset form fields.
   * @returns {Promise<void>}
   */
  async function onSubmit(values: ResetPasswordFormValues) {
    try {
      const response = await resetPasswordRequest(values)
      pushSuccess(response.message)
      setTimeout(() => {
        void navigate('/login')
      }, 1200)
    } catch (error) {
      pushError(getApiErrorMessage(error))
    }
  }

  /**
   * @description Resends reset OTP if the previous expired.
   * @async
   * @param {string} email - Destination email.
   * @returns {Promise<void>}
   */
  async function handleResend(email: string) {
    if (!email) {
      return
    }
    try {
      const response = await resendOtpRequest({ email, purpose: 'reset' })
      pushSuccess(response.message)
    } catch (error) {
      pushError(getApiErrorMessage(error))
    }
  }

  return (
    <AuthSplitLayout
      title="Create new password"
      subtitle="Enter the verification code from your email and pick a strong replacement password."
      badge="Account Recovery"
      imageSrc={loginVisual}
      imageAlt="Repairex Account Security"
      quoteTitle="Keep your account protected."
      quoteDescription="Choose a strong password with a mix of numbers and characters to keep your repair records safe."
      footer={
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Back to log in
        </Link>
      }
    >
      <form
        className="space-y-4"
        noValidate
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event)
        }}
      >
        <div className="space-y-1.5">
          <label htmlFor="reset-email" className="text-ui font-medium text-foreground">
            Account email <span className="text-destructive">*</span>
          </label>
          <Input
            id="reset-email"
            type="email"
            autoComplete="email"
            className={cn(errors.email && 'border-destructive focus-visible:ring-destructive/20')}
            {...register('email')}
          />
          {errors.email ? (
            <p className="text-caption text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="reset-otp" className="text-ui font-medium text-foreground">
            6-digit code <span className="text-destructive">*</span>
          </label>
          <Input
            id="reset-otp"
            inputMode="numeric"
            placeholder="000000"
            maxLength={6}
            className={cn(
              'font-mono tracking-[0.3em]',
              errors.otp && 'border-destructive focus-visible:ring-destructive/20',
            )}
            {...register('otp')}
          />
          {errors.otp ? (
            <p className="text-caption text-destructive">{errors.otp.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="reset-password" className="text-ui font-medium text-foreground">
            New password <span className="text-destructive">*</span>
          </label>
          <PasswordField
            id="reset-password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.password?.message}
            registration={register('password')}
            strengthSlot={<PasswordStrengthBar password={passwordValue} />}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="reset-confirm-password"
            className="text-ui font-medium text-foreground"
          >
            Confirm new password <span className="text-destructive">*</span>
          </label>
          <PasswordField
            id="reset-confirm-password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            registration={register('confirmPassword')}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.99]"
        >
          {isSubmitting ? 'Updating…' : 'Update password'}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            void handleResend(emailFromQuery)
          }}
          className="h-11 w-full rounded-xl border-border/80 bg-background hover:bg-muted text-foreground transition-all"
        >
          Resend code
        </Button>
      </form>
    </AuthSplitLayout>
  )
}
