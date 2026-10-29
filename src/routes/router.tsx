import { createBrowserRouter } from 'react-router-dom'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { RouteScrollReset } from '@/components/layout/RouteScrollReset'
import { AboutPage } from '@/pages/AboutPage'
import { ContactPage } from '@/pages/ContactPage'
import { CustomerDashboardPage } from '@/pages/CustomerDashboardPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NewRepairRequestPage } from '@/pages/NewRepairRequestPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RepairDetailPage } from '@/pages/RepairDetailPage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { SignupPage } from '@/pages/SignupPage'
import { VendorMarketplacePage } from '@/pages/VendorMarketplacePage'
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
          <DashboardLayout />
        </>
      ),
      children: [
        { index: true, element: <CustomerDashboardPage /> },
        { path: 'marketplace', element: <VendorMarketplacePage /> },
        { path: 'new-repair', element: <NewRepairRequestPage /> },
        { path: 'repairs/:id', element: <RepairDetailPage /> },
      ],
    },
  ])
}
