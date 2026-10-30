import { z } from 'zod'

/** @description Shared password validation (matches backend). */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .regex(/\d/, 'Include at least one number.')
  .regex(/[^A-Za-z0-9]/, 'Include at least one special character.')

export const signupSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Enter your full name.'),
    email: z.string().trim().email('Enter a valid email address.'),
    password: passwordSchema,
    confirmPassword: z.string(),
    role: z.enum(['customer', 'vendor']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
})

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .length(6, 'Enter the 6-digit code.')
    .regex(/^\d+$/, 'Use numbers only.'),
})

export const resetPasswordSchema = z
  .object({
    email: z.string().trim().email(),
    otp: z.string().trim().length(6, 'Enter the 6-digit code.'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type SignupFormValues = z.infer<typeof signupSchema>
export type LoginFormValues = z.infer<typeof loginSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

/** @description Password change on dashboard profile (email comes from session). */
export const profilePasswordResetSchema = z
  .object({
    otp: z
      .string()
      .trim()
      .length(6, 'Enter the 6-digit code.')
      .regex(/^\d+$/, 'Use numbers only.'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type ProfilePasswordResetFormValues = z.infer<typeof profilePasswordResetSchema>

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter at least 2 characters.').max(80, 'Name is too long.'),
})

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>
