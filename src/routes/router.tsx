import { createBrowserRouter } from 'react-router-dom'

import { PublicLayout } from '@/components/layout/PublicLayout'
import { RouteScrollReset } from '@/components/layout/RouteScrollReset'
import { AboutPage } from '@/pages/AboutPage'
import { ContactPage } from '@/pages/ContactPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { SignupPage } from '@/pages/SignupPage'

/**
 * @description Application route tree for public marketing pages (Phase 0 shell).
 * @returns {ReturnType<typeof createBrowserRouter>} Configured browser router.
 */
export function createAppRouter() {
  return createBrowserRouter([
    {
      path: '/',
      element: <PublicLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'about', element: <AboutPage /> },
        { path: 'contact', element: <ContactPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
    {
      path: '/login',
      element: (
        <>
          <RouteScrollReset />
          <LoginPage />
        </>
      ),
    },
    {
      path: '/signup',
      element: (
        <>
          <RouteScrollReset />
          <SignupPage />
        </>
      ),
    },
  ])
}
