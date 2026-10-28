import { Outlet } from 'react-router-dom'

import { PublicFooter } from '@/components/layout/PublicFooter'
import { PublicNavbar } from '@/components/layout/PublicNavbar'

/**
 * @description Layout wrapper for Home, About, and Contact public routes.
 * @returns {JSX.Element} Navbar, page outlet, and footer.
 */
export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <PublicNavbar />
      <Outlet />
      <PublicFooter />
    </div>
  )
}
