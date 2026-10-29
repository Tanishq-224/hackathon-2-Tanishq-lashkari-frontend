import type { ComponentType } from 'react'
import { render, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

import { PublicLayout } from '@/components/layout/PublicLayout'
import { AppProviders } from '@/providers/AppProviders'
import { AboutPage } from '@/pages/AboutPage'
import { ContactPage } from '@/pages/ContactPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'

/**
 * @description Renders a route tree inside the same providers used by the app.
 * @param {object} options - Router entries and child route config.
 * @returns {void}
 */
function renderPublicRoute(
  Page: ComponentType,
  path: string,
  initialEntry: string,
) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <PublicLayout />,
        children: [{ path, element: <Page /> }],
      },
    ],
    { initialEntries: [initialEntry] },
  )

  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
}

describe('HomePage routing shell', () => {
  it('renders the hero value proposition', async () => {
    renderPublicRoute(HomePage, '', '/')

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /compare repair options with/i,
      }),
    ).toBeInTheDocument()
  })

  it('includes all eight brief-defined home sections', () => {
    renderPublicRoute(HomePage, '', '/')

    expect(
      screen.getByRole('region', { name: /supported device categories/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: /common repair problems/i }),
    ).toBeInTheDocument()
    expect(document.getElementById('how-it-works')).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: /why choose repairex/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: /for customers and vendors/i }),
    ).toBeInTheDocument()
    expect(document.getElementById('faq')).toBeInTheDocument()
    expect(document.getElementById('get-started')).toBeInTheDocument()
  })

  it('renders a theme toggle in the public navbar', () => {
    renderPublicRoute(HomePage, '', '/')

    expect(
      screen.getByRole('button', { name: /switch to (light|dark) theme/i }),
    ).toBeInTheDocument()
  })

  it('exposes primary public navigation links', () => {
    renderPublicRoute(HomePage, '', '/')

    const nav = screen.getByRole('navigation', { name: /primary/i })
    expect(within(nav).getByRole('link', { name: /^about$/i })).toHaveAttribute(
      'href',
      '/about',
    )
  })

  it('shows log in entry point in the navbar', async () => {
    renderPublicRoute(HomePage, '', '/')

    const header = screen.getByRole('banner')
    expect(
      await within(header).findByRole('link', { name: /^log in$/i }),
    ).toHaveAttribute('href', '/login')
  })
})

describe('AboutPage public sections', () => {
  it('renders brief-aligned about regions', async () => {
    renderPublicRoute(AboutPage, 'about', '/about')

    expect(
      await screen.findByRole('region', { name: /about repairex/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: /the problem repairex addresses/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: /the repairex solution/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: /repair workflow overview/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: /product principles/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: /get started with repairex/i }),
    ).toBeInTheDocument()
  })
})

describe('ContactPage public sections', () => {
  it('renders contact form and support channels', async () => {
    renderPublicRoute(ContactPage, 'contact', '/contact')

    expect(
      await screen.findByRole('region', {
        name: /contact information and support channels/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /^contact form$/i })).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: /support frequently asked questions/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: /start a repair request/i }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
  })
})

describe('Login page shell', () => {
  it('renders login form without public footer chrome', () => {
    const router = createMemoryRouter(
      [{ path: '/login', element: <LoginPage /> }],
      { initialEntries: ['/login'] },
    )

    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>,
    )

    expect(screen.getByRole('heading', { level: 1, name: /welcome back/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /forgot password/i })).toBeInTheDocument()
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
  })

  it('renders login page with public header and footer inside PublicLayout', async () => {
    renderPublicRoute(LoginPage, 'login', '/login')

    expect(await screen.findByRole('heading', { level: 1, name: /welcome back/i })).toBeInTheDocument()
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders signup page with customer and vendor role choices inside PublicLayout', async () => {
    renderPublicRoute(SignupPage, 'signup', '/signup')

    expect(await screen.findByRole('heading', { level: 1, name: /create your account/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /customer/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /vendor/i })).toBeInTheDocument()
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
