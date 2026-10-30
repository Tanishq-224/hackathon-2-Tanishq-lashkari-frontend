import { Outlet, useLocation, useMatches } from 'react-router-dom'

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
type PublicRouteHandle = {
  layout?: 'not-found'
}

export function PublicLayout() {
  const { pathname } = useLocation()
  const matches = useMatches()
  const isNotFoundPage = matches.some(
    (match) => (match.handle as PublicRouteHandle | undefined)?.layout === 'not-found',
  )
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
        <div
          className={cn(
            'flex min-h-screen flex-col text-foreground',
            isNotFoundPage ? 'bg-black' : 'bg-background',
          )}
        >
          <PublicNavbar />
          <div
            className={cn(
              'flex flex-1 flex-col',
              !isNotFoundPage &&
                !isHome &&
                pathname !== '/about' &&
                pathname !== '/contact' &&
                !isAuthPage &&
                'pt-[5.5rem] sm:pt-24',
            )}
          >
            <Outlet />
          </div>
          <div className={cn(isNotFoundPage && 'relative z-[2]')}>
            <PublicFooter />
          </div>
          <ScrollToTopButton />
        </div>
      </PageRevealGate>
    </LenisScrollProvider>
  )
}
