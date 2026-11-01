import { Navigate, Outlet } from 'react-router-dom'

import { useAuthSession } from '@/hooks/useAuthSession'

/**
 * @description Restricts child routes to authenticated platform admins.
 */
export function AdminRouteGuard() {
  const { user, isLoading, isAuthenticated } = useAuthSession()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
