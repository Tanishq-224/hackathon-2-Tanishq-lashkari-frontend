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
import { GoogleSignInButton } from '@/features/auth/components/GoogleSignInButton'
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
        {/* Google Identity Services Sign-Up Button */}
        <GoogleSignInButton text="signup_with" onError={setFormError} />

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
