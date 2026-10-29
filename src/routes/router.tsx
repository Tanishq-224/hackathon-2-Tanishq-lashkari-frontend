import { createBrowserRouter } from 'react-router-dom'

import { PublicLayout } from '@/components/layout/PublicLayout'
import { RouteScrollReset } from '@/components/layout/RouteScrollReset'
import { AboutPage } from '@/pages/AboutPage'
import { ContactPage } from '@/pages/ContactPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { SignupPage } from '@/pages/SignupPage'
import { DashboardShellPage } from '@/pages/DashboardShellPage'
import { VerifyOtpPage } from '@/pages/VerifyOtpPage'

/**
 * @description Application route tree with shared public chrome (Navbar & Footer) across marketing and auth views.
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
        { path: 'login', element: <LoginPage /> },
        { path: 'signup', element: <SignupPage /> },
        { path: 'forgot-password', element: <ForgotPasswordPage /> },
        { path: 'verify-otp', element: <VerifyOtpPage /> },
        { path: 'reset-password', element: <ResetPasswordPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
    {
      path: '/dashboard',
      element: (
        <>
          <RouteScrollReset />
          <DashboardShellPage />
        </>
      ),
    },
  ])
}
