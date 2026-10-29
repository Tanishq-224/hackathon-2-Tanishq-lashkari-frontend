import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { User, Wrench } from 'lucide-react'

import signupVisual from '@/assets/signup-visual.jpg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signupRequest } from '@/features/auth/api/authApi'
import { AuthSplitLayout } from '@/features/auth/components/AuthSplitLayout'
import { PasswordField } from '@/features/auth/components/PasswordField'
import { PasswordStrengthBar } from '@/features/auth/components/PasswordStrengthBar'
import {
  signupSchema,
  type SignupFormValues,
} from '@/features/auth/lib/auth-schemas'
import { getApiErrorMessage } from '@/lib/api-client'
import { cn } from '@/lib/utils'

/**
 * @description Customer/vendor registration with OTP verification follow-up.
 * @returns {JSX.Element} Sign-up page.
 */
export function SignupPage() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'customer',
    },
  })

  const passwordValue = watch('password')
  const selectedRole = watch('role')

  /**
   * @description Directs browser to backend Google OAuth initiation endpoint.
   */
  function handleGoogleSignIn() {
    const apiBase = import.meta.env?.VITE_API_URL ?? 'http://localhost:5000'
    window.location.href = `${apiBase}/api/auth/google`
  }

  /**
   * @description Submits signup and routes to OTP verification.
   * @async
   * @param {SignupFormValues} values - Validated signup fields.
   * @returns {Promise<void>}
   */
  async function onSubmit(values: SignupFormValues) {
    setFormError(null)
    try {
      await signupRequest(values)
      void navigate(
        `/verify-otp?email=${encodeURIComponent(values.email)}&purpose=signup`,
      )
    } catch (error) {
      setFormError(getApiErrorMessage(error))
    }
  }

  return (
    <AuthSplitLayout
      title="Create your account"
      subtitle="Join Repairex to submit repair requests or join as a verified repair partner."
      badge="Join Repairex"
      imageSrc={signupVisual}
      imageAlt="Repairex Modern Electronics Workshop"
      quoteTitle="Fair estimates. Certified service."
      quoteDescription="Connect with local certified repair technicians, compare structured preliminary estimates, and track repairs with complete confidence."
      highlights={[
        'Free to submit repair requests',
        'Compare multiple technician quotes',
        'Customer approval before any work starts',
      ]}
      footer={
        <p>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </p>
      }
    >
      <div className="space-y-4">
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
          <span>Sign up with Google</span>
        </Button>

        {/* Clean Flex Separator */}
        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-border/80" />
          <span className="text-caption font-semibold uppercase tracking-wider text-muted-foreground/80">
            or register with email
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
        {/* Role Selection Switcher */}
        <div className="space-y-1.5">
          <label className="text-ui font-medium text-foreground">
            I am joining as <span className="text-destructive">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue('role', 'customer', { shouldValidate: true })}
              className={cn(
                'flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all',
                selectedRole === 'customer'
                  ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20'
                  : 'border-border/80 bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground',
              )}
            >
              <div className="flex items-center gap-2 font-semibold">
                <User className="size-4" />
                <span>Customer</span>
              </div>
              <span className="text-caption text-muted-foreground">I need a device repaired</span>
            </button>

            <button
              type="button"
              onClick={() => setValue('role', 'vendor', { shouldValidate: true })}
              className={cn(
                'flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all',
                selectedRole === 'vendor'
                  ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20'
                  : 'border-border/80 bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground',
              )}
            >
              <div className="flex items-center gap-2 font-semibold">
                <Wrench className="size-4" />
                <span>Vendor</span>
              </div>
              <span className="text-caption text-muted-foreground">I provide repair services</span>
            </button>
          </div>
          <input type="hidden" {...register('role')} />
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="signup-full-name" className="text-ui font-medium text-foreground">
            Full name <span className="text-destructive">*</span>
          </label>
          <Input
            id="signup-full-name"
            autoComplete="name"
            placeholder="Andrew Thomas"
            className={cn(errors.fullName && 'border-destructive focus-visible:ring-destructive/20')}
            {...register('fullName')}
          />
          {errors.fullName ? (
            <p className="text-caption text-destructive">{errors.fullName.message}</p>
          ) : null}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label htmlFor="signup-email" className="text-ui font-medium text-foreground">
            Email address <span className="text-destructive">*</span>
          </label>
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="andrew@example.com"
            className={cn(errors.email && 'border-destructive focus-visible:ring-destructive/20')}
            {...register('email')}
          />
          {errors.email ? (
            <p className="text-caption text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="signup-password" className="text-ui font-medium text-foreground">
            Password <span className="text-destructive">*</span>
          </label>
          <PasswordField
            id="signup-password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.password?.message}
            registration={register('password')}
            strengthSlot={<PasswordStrengthBar password={passwordValue} />}
          />
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="signup-confirm-password"
            className="text-ui font-medium text-foreground"
          >
            Confirm password <span className="text-destructive">*</span>
          </label>
          <PasswordField
            id="signup-confirm-password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            registration={register('confirmPassword')}
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
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>

        <p className="text-caption leading-relaxed text-muted-foreground text-center">
          By registering, you agree to our Terms of Service and Privacy Policy. A 6-digit OTP will be sent to your email.
        </p>
      </form>
    </div>
  </AuthSplitLayout>
  )
}
