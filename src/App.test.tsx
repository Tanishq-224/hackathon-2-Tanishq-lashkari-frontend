import { render, screen } from '@testing-library/react'

import App from './App'

describe('App', () => {
  it('renders the Repairex product title', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: /repairex/i }),
    ).toBeInTheDocument()
  })

  it('shows Phase 0 setup status text', () => {
    render(<App />)

    expect(
      screen.getByText(/frontend foundation setup in progress/i),
    ).toBeInTheDocument()
  })
})
