import { createBrowserRouter } from 'react-router-dom'

import { PublicLayout } from '@/components/layout/PublicLayout'
import { AboutPage } from '@/pages/AboutPage'
import { ContactPage } from '@/pages/ContactPage'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'

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
  ])
}
