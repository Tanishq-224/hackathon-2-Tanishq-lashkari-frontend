import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import loginVisual from '@/assets/login-visual.jpg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { loginRequest } from '@/features/auth/api/authApi'
import { AuthSplitLayout } from '@/features/auth/components/AuthSplitLayout'
import { GoogleSignInButton } from '@/features/auth/components/GoogleSignInButton'
import { PasswordField } from '@/features/auth/components/PasswordField'
import { loginSchema, type LoginFormValues } from '@/features/auth/lib/auth-schemas'
import { authSessionQueryKey } from '@/hooks/useAuthSession'
import { getApiErrorMessage } from '@/lib/api-client'
import { cn } from '@/lib/utils'

/**
 * @description Email/password & Google OAuth login for verified Repairex accounts.
 * @returns {JSX.Element} Login page.
 */
export function LoginPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const oauthError = searchParams.get('error')
  const [formError, setFormError] = useState<string | null>(oauthError)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })


  /**
   * @description Authenticates and refreshes session state in the navbar.
   * @async
   * @param {LoginFormValues} values - Login credentials.
   * @returns {Promise<void>}
   */
  async function onSubmit(values: LoginFormValues) {
    setFormError(null)
    try {
      await loginRequest(values)
      await queryClient.invalidateQueries({ queryKey: authSessionQueryKey })
      void navigate('/')
    } catch (error) {
      const message = getApiErrorMessage(error)
      setFormError(message)
      if (message.toLowerCase().includes('verify your email')) {
        void navigate(
          `/verify-otp?email=${encodeURIComponent(values.email)}&purpose=signup`,
        )
      }
    }
  }

  return (
    <AuthSplitLayout
      title="Welcome back"
      subtitle="Log in to manage your repair requests, compare estimates, and approve quotations."
      badge="Secure Portal"
      imageSrc={loginVisual}
      imageAlt="Repairex Mobile Repair Tracking"
      quoteTitle="Your device repairs, under your control."
      quoteDescription="Review diagnostic reports, track progress step by step, and approve quotations with total transparency."
      highlights={[
        'Real-time status updates',
        'Itemized cost breakdown',
        'Direct technician communication',
      ]}
      footer={
        <p>
          New to Repairex?{' '}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      }
    >
      <div className="space-y-5">
        {/* Google Identity Services Sign-In Button */}
        <GoogleSignInButton onError={setFormError} />

        {/* Clean Flex Separator */}
        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-border/80" />
          <span className="text-caption font-semibold uppercase tracking-wider text-muted-foreground/80">
            or continue with email
          </span>
          <div className="h-px flex-1 bg-border/80" />
        </div>

        <form
          className="space-y-4"
          noValidate
          onSubmit={(event) => {
            void handleSubmit(onSubmit)(event)
          }}
        >
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="text-ui font-medium text-foreground">
              Email address <span className="text-destructive">*</span>
            </label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="e.g. alex@example.com"
              className={cn(errors.email && 'border-destructive focus-visible:ring-destructive/20')}
              {...register('email')}
            />
            {errors.email ? (
              <p className="text-caption text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="login-password" className="text-ui font-medium text-foreground">
                Password <span className="text-destructive">*</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-caption font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordField
              id="login-password"
              autoComplete="current-password"
              placeholder="Enter your password"
              error={errors.password?.message}
              registration={register('password')}
            />
          </div>

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
            {isSubmitting ? 'Logging in…' : 'Log in to Repairex'}
          </Button>
        </form>
      </div>
    </AuthSplitLayout>
  )
}
