import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import loginVisual from '@/assets/login-visual.jpg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { forgotPasswordRequest } from '@/features/auth/api/authApi'
import { AuthSplitLayout } from '@/features/auth/components/AuthSplitLayout'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/features/auth/lib/auth-schemas'
import { useAppToast } from '@/components/shared/AppToastProvider'
import { getApiErrorMessage } from '@/lib/api-client'
import { cn } from '@/lib/utils'

/**
 * @description Starts password reset by emailing a 6-digit OTP.
 * @returns {JSX.Element} Forgot password page.
 */
export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { pushError, pushSuccess } = useAppToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  /**
   * @description Sends reset OTP and navigates to reset form.
   * @async
   * @param {ForgotPasswordFormValues} values - Email field.
   * @returns {Promise<void>}
   */
  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      const response = await forgotPasswordRequest(values.email)
      pushSuccess(response.message)
      void navigate(
        `/verify-otp?email=${encodeURIComponent(values.email)}&purpose=reset`,
      )
    } catch (error) {
      pushError(getApiErrorMessage(error))
    }
  }

  return (
    <AuthSplitLayout
      title="Reset your password"
      subtitle="Enter your verified account email address and we'll send a 6-digit reset code."
      badge="Account Recovery"
      imageSrc={loginVisual}
      imageAlt="Repairex Account Security"
      quoteTitle="Regain quick, safe access."
      quoteDescription="We use secure one-time verification codes so you can restore access to your account and repair history safely."
      highlights={[
        'Fast one-time recovery code',
        'Secure password update',
        'Active repair data preserved',
      ]}
      footer={
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Back to log in
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
          <label htmlFor="forgot-email" className="text-ui font-medium text-foreground">
            Account email <span className="text-destructive">*</span>
          </label>
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="alex@example.com"
            className={cn(errors.email && 'border-destructive focus-visible:ring-destructive/20')}
            {...register('email')}
          />
          {errors.email ? (
            <p className="text-caption text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.99]"
        >
          {isSubmitting ? 'Sending code…' : 'Send verification code'}
        </Button>
      </form>
    </AuthSplitLayout>
  )
}
