import { z } from 'zod'

import {
  emailField,
  otpField,
  passwordField,
  personNameField,
} from '@/lib/validation/fields'

export { passwordField as passwordSchema } from '@/lib/validation/fields'

export const signupSchema = z
  .object({
    fullName: personNameField,
    email: emailField,
    password: passwordField,
    confirmPassword: z.string(),
    role: z.enum(['customer', 'vendor']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Enter your password.'),
})

export const forgotPasswordSchema = z.object({
  email: emailField,
})

export const verifyOtpSchema = z.object({
  otp: otpField,
})

export const resetPasswordSchema = z
  .object({
    email: emailField,
    otp: otpField,
    password: passwordField,
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

export const profilePasswordResetSchema = z
  .object({
    otp: otpField,
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type ProfilePasswordResetFormValues = z.infer<typeof profilePasswordResetSchema>

export const updateProfileSchema = z.object({
  fullName: personNameField,
})

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>
