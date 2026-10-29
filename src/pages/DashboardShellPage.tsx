import { Link } from 'react-router-dom'

import { Container } from '@/components/shared/Container'
import { Button } from '@/components/ui/button'
import { logoutRequest } from '@/features/auth/api/authApi'
import { authSessionQueryKey, useAuthSession } from '@/hooks/useAuthSession'
import { useQueryClient } from '@tanstack/react-query'
import { Navigate } from 'react-router-dom'

/**
 * @description Temporary post-login landing until Phase 3 customer/vendor dashboards ship.
 * @returns {JSX.Element} Dashboard placeholder.
 */
export function DashboardShellPage() {
  const { isAuthenticated, user, isLoading } = useAuthSession()
  const queryClient = useQueryClient()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  /**
   * @description Clears session and returns to the home page.
   * @async
   * @returns {Promise<void>}
   */
  async function handleLogout() {
    await logoutRequest()
    await queryClient.invalidateQueries({ queryKey: authSessionQueryKey })
  }

  return (
    <main className="min-h-dvh bg-background py-16">
      <Container className="max-w-lg">
        <h1 className="font-display text-h1 font-bold text-foreground">Dashboard</h1>
        <p className="mt-3 text-body text-muted-foreground">
          Signed in as {user?.fullName} ({user?.role}). Repair request dashboards
          arrive in Phase 3.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={() => {
              void handleLogout()
            }}
          >
            Log out
          </Button>
          <Link to="/" className="inline-flex items-center text-primary hover:underline">
            Back to home
          </Link>
        </div>
      </Container>
    </main>
  )
}
