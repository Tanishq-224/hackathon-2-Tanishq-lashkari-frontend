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
   * @description Directs browser to backend Google OAuth initiation endpoint.
   */
  function handleGoogleSignIn() {
    const apiBase = import.meta.env?.VITE_API_URL ?? 'http://localhost:5000'
    window.location.href = `${apiBase}/api/auth/google`
  }

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
        {/* Google OAuth Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          className="h-12 w-full rounded-xl border border-border bg-card hover:bg-card/85 font-medium text-foreground flex items-center justify-center gap-3 transition-all active:scale-[0.99] shadow-xs hover:border-foreground/30"
        >
          <svg className="size-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </Button>

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
