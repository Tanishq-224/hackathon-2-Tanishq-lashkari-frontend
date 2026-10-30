import { Outlet, useLocation } from 'react-router-dom'

import { LenisScrollProvider } from '@/components/layout/LenisScrollProvider'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { RouteScrollReset } from '@/components/layout/RouteScrollReset'
import { PageRevealGate } from '@/components/reveal/PageRevealGate'
import { ScrollToTopButton } from '@/components/shared/ScrollToTopButton'
import { cn } from '@/lib/utils'

/**
 * @description Layout wrapper for Home, About, and Contact public routes.
 * @returns {JSX.Element} Navbar, page outlet, and footer.
 */
export function PublicLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/verify-otp' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password'

  return (
    <LenisScrollProvider>
      <PageRevealGate>
        <RouteScrollReset />
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <PublicNavbar />
          <div
            className={cn(
              'flex flex-1 flex-col',
              !isHome &&
                pathname !== '/about' &&
                pathname !== '/contact' &&
                !isAuthPage &&
                'pt-[5.5rem] sm:pt-24',
            )}
          >
            <Outlet />
          </div>
          <PublicFooter />
          <ScrollToTopButton />
        </div>
      </PageRevealGate>
    </LenisScrollProvider>
  )
}
