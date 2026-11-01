import { z } from 'zod'

const PERSON_NAME_REGEX = /^[\p{L}\p{M}][\p{L}\p{M}\s'.-]*[\p{L}\p{M}]$|^[\p{L}\p{M}]$/u
const DEVICE_LABEL_REGEX = /^[\p{L}\p{N}\s+\-_.#/()]+$/u
const PHONE_CHARS_REGEX = /^[\d+\s().-]+$/

export const personNameField = z
  .string()
  .trim()
  .min(2, 'Enter your full name.')
  .max(80, 'Name is too long.')
  .regex(PERSON_NAME_REGEX, 'Use letters and common name punctuation only.')
  .refine((value) => !/\d/.test(value), {
    message: 'Names cannot contain numbers.',
  })

export const emailField = z
  .string()
  .trim()
  .min(1, 'Enter your email address.')
  .max(120, 'Email is too long.')
  .email('Enter a valid email address.')
  .transform((value) => value.toLowerCase())

export const otpField = z
  .string()
  .trim()
  .regex(/^\d{6}$/, 'Enter the 6-digit code.')

export const passwordField = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .regex(/\d/, 'Include at least one number.')
  .regex(/[^A-Za-z0-9]/, 'Include at least one special character.')

export const optionalPhoneField = z
  .string()
  .trim()
  .max(24, 'Phone number is too long.')
  .optional()
  .refine((value) => !value || PHONE_CHARS_REGEX.test(value), {
    message: 'Use digits and phone separators only (+, spaces, hyphens).',
  })

export function longTextField(min: number, max: number, label = 'Text') {
  return z
    .string()
    .trim()
    .min(min, `${label} must be at least ${min} characters.`)
    .max(max, `${label} is too long (${max} characters max).`)
}

export function shortLabelField(max = 100) {
  return z
    .string()
    .trim()
    .min(2, 'Enter at least 2 characters.')
    .max(max, `Cannot exceed ${max} characters.`)
}

export const deviceBrandField = z
  .string()
  .trim()
  .min(1, 'Please enter the device brand.')
  .max(60, 'Brand name is too long.')
  .regex(DEVICE_LABEL_REGEX, 'Brand contains invalid characters.')

export const deviceModelField = z
  .string()
  .trim()
  .min(1, 'Please enter the device model.')
  .max(100, 'Model name is too long.')
  .regex(DEVICE_LABEL_REGEX, 'Model contains invalid characters.')

/** @description Optional customer/vendor feedback (decline quotes, etc.). */
export const optionalFeedbackField = z
  .string()
  .trim()
  .max(1000, 'Feedback cannot exceed 1000 characters.')
  .optional()
  .transform((value) => (value === '' ? undefined : value))

/** @description Strip non-digits from OTP input while typing (preserves string type). */
export function sanitizeOtpInput(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 6)
}

/** @description Restrict phone input to allowed characters while typing. */
export function sanitizePhoneInput(raw: string): string {
  return raw.replace(/[^\d+\s().-]/g, '').slice(0, 24)
}

/** @description Parse decimal money from form string; null if invalid. */
export function parseMoneyInput(raw: string): number | null {
  const trimmed = raw.trim()
  if (!trimmed) {
    return null
  }
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return null
  }
  const value = Number(trimmed)
  return Number.isFinite(value) ? value : null
}

/** @description Integer-only non-negative input (warranty months, quantities). */
export function sanitizeNonNegativeIntInput(raw: string, maxDigits = 3): string {
  return raw.replace(/\D/g, '').slice(0, maxDigits)
}
