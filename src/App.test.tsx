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
  it('renders the Repairex product title', () => {
    renderHomeRoute()

    expect(
      screen.getByRole('heading', { level: 1, name: /repairex/i }),
    ).toBeInTheDocument()
  })

  it('shows Phase 0 setup status text', () => {
    renderHomeRoute()

    expect(
      screen.getByText(/frontend foundation setup in progress/i),
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
})
