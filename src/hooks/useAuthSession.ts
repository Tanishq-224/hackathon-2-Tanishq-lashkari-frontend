import { useQuery } from '@tanstack/react-query'

import { fetchCurrentUser, type AuthUser } from '@/features/auth/api/authApi'

export type AuthSessionUser = AuthUser

export type AuthSessionState = {
  isAuthenticated: boolean
  user: AuthSessionUser | null
  isLoading: boolean
}

/** @description TanStack Query key for the current auth session. */
export const authSessionQueryKey = ['auth', 'me'] as const

/**
 * @description Reads the current auth session for public chrome (navbar avatar vs login buttons).
 * @returns {AuthSessionState} Session flags and user profile when logged in.
 * @example
 * const { isAuthenticated, user } = useAuthSession()
 */
export function useAuthSession(): AuthSessionState {
  const { data, isLoading } = useQuery({
    queryKey: authSessionQueryKey,
    queryFn: fetchCurrentUser,
    staleTime: 60_000,
    retry: false,
  })

  return {
    isAuthenticated: Boolean(data),
    user: data ?? null,
    isLoading,
  }
}

/**
 * @description Builds one- or two-letter initials for the profile avatar chip.
 * @param {string} fullName - Display name from the authenticated user.
 * @returns {string} Uppercase initials (max two characters).
 */
export function getProfileInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) {
    return '?'
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
}
