import { apiClient } from '@/lib/api-client'
import type { LoginFormValues } from '@/features/auth/lib/auth-schemas'
import type { ResetPasswordFormValues } from '@/features/auth/lib/auth-schemas'
import type { SignupFormValues } from '@/features/auth/lib/auth-schemas'

export type AuthUser = {
  id: string
  fullName: string
  email: string
  role: 'customer' | 'vendor' | 'admin'
}

type AuthEnvelope = {
  success: boolean
  message: string
  data?: {
    user?: {
      sub?: string
      id?: string
      email: string
      role: AuthUser['role']
      fullName?: string
    }
  }
}

/**
 * @description Registers a new account and triggers signup OTP email.
 * @async
 * @param {SignupFormValues} payload - Signup form values.
 * @returns {Promise<AuthEnvelope>} API message envelope.
 */
export async function signupRequest(payload: SignupFormValues): Promise<AuthEnvelope> {
  const { data } = await apiClient.post<AuthEnvelope>('/api/auth/signup', payload)
  return data
}

/**
 * @description Logs in with email and password (verified accounts only).
 * @async
 * @param {LoginFormValues} payload - Login credentials.
 * @returns {Promise<AuthEnvelope>} API message envelope.
 */
export async function loginRequest(payload: LoginFormValues): Promise<AuthEnvelope> {
  const { data } = await apiClient.post<AuthEnvelope>('/api/auth/login', payload)
  return data
}

/**
 * @description Authenticates using a Google Identity Services credential token.
 * @async
 * @param {string} credential - Google ID token.
 * @returns {Promise<AuthEnvelope>}
 */
export async function googleSignInRequest(credential: string): Promise<AuthEnvelope> {
  const { data } = await apiClient.post<AuthEnvelope>('/api/auth/google', { credential })
  return data
}

/**
 * @description Verifies signup OTP and establishes session cookie.
 * @async
 * @param {object} payload - Email and OTP code.
 * @returns {Promise<AuthEnvelope>} API success envelope.
 */
export async function verifySignupOtpRequest(payload: {
  email: string
  otp: string
}): Promise<AuthEnvelope> {
  const { data } = await apiClient.post<AuthEnvelope>('/api/auth/verify-otp', {
    ...payload,
    purpose: 'signup',
  })
  return data
}

/**
 * @description Requests a password reset OTP email.
 * @async
 * @param {string} email - Account email.
 * @returns {Promise<AuthEnvelope>} Generic success message.
 */
export async function forgotPasswordRequest(email: string): Promise<AuthEnvelope> {
  const { data } = await apiClient.post<AuthEnvelope>('/api/auth/forgot-password', {
    email,
  })
  return data
}

/**
 * @description Completes password reset with OTP and new password.
 * @async
 * @param {ResetPasswordFormValues} payload - Reset form values.
 * @returns {Promise<AuthEnvelope>} Success message.
 */
export async function resetPasswordRequest(
  payload: ResetPasswordFormValues,
): Promise<AuthEnvelope> {
  const { data } = await apiClient.post<AuthEnvelope>('/api/auth/reset-password', payload)
  return data
}

/**
 * @description Resends OTP for signup or password reset.
 * @async
 * @param {object} payload - Email and flow purpose.
 * @returns {Promise<AuthEnvelope>} Success message.
 */
export async function resendOtpRequest(payload: {
  email: string
  purpose: 'signup' | 'reset'
}): Promise<AuthEnvelope> {
  const { data } = await apiClient.post<AuthEnvelope>('/api/auth/resend-otp', payload)
  return data
}

/**
 * @description Logs out and clears session cookie server-side.
 * @async
 * @returns {Promise<void>}
 */
export async function logoutRequest(): Promise<void> {
  await apiClient.post('/api/auth/logout')
}

/**
 * @description Loads the current session user from the HTTP-only cookie.
 * @async
 * @returns {Promise<AuthUser | null>} User profile or null when logged out.
 */
export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data } = await apiClient.get<{
      success: boolean
      data?: { user: AuthUser }
    }>('/api/auth/me')

    return data.data?.user ?? null
  } catch {
    return null
  }
}
