import { render, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

import { PublicLayout } from '@/components/layout/PublicLayout'
import { AppProviders } from '@/providers/AppProviders'
import { HomePage } from '@/pages/HomePage'

/**
 * @description Renders the home route inside the same providers used by the app.
 * @returns {void}
 */
function renderHomeRoute() {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <PublicLayout />,
        children: [{ index: true, element: <HomePage /> }],
      },
    ],
    { initialEntries: ['/'] },
  )

  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
}

describe('HomePage routing shell', () => {
  it('renders the hero value proposition', async () => {
    renderHomeRoute()

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /compare repair options with/i,
      }),
    ).toBeInTheDocument()
  })

  it('includes all eight brief-defined home sections', () => {
    renderHomeRoute()

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
    renderHomeRoute()

    expect(
      screen.getByRole('button', { name: /switch to (light|dark) theme/i }),
    ).toBeInTheDocument()
  })

  it('exposes primary public navigation links', () => {
    renderHomeRoute()

    const nav = screen.getByRole('navigation', { name: /primary/i })
    expect(within(nav).getByRole('link', { name: /^about$/i })).toHaveAttribute(
      'href',
      '/about',
    )
  })

  it('shows log in entry point in the navbar', () => {
    renderHomeRoute()

    const header = screen.getByRole('banner')
    expect(
      within(header).getByRole('link', { name: /^log in$/i }),
    ).toHaveAttribute('href', '/login')
  })
})
