import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { customerRepairsQueryKey } from '@/features/repairs/api/repairsApi'
import { CustomerDashboardPage } from '@/pages/CustomerDashboardPage'
import { NewRepairRequestPage } from '@/pages/NewRepairRequestPage'

function renderWithProviders(ui: React.ReactElement, initialRepairs = []) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  // Seed cache so components render immediately
  queryClient.setQueryData(customerRepairsQueryKey, initialRepairs)

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('Phase 3 Customer Repairs UI', () => {
  it('renders Customer Dashboard with heading and action button', () => {
    renderWithProviders(<CustomerDashboardPage />, [])

    expect(
      screen.getByRole('heading', { level: 1, name: /Repair Requests/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/New Repair Request/i)).toBeInTheDocument()
    expect(screen.getByText(/Total Requests/i)).toBeInTheDocument()
    expect(
      screen.getByText(/No repair requests submitted yet/i),
    ).toBeInTheDocument()
  })

  it('renders New Repair Request form with all essential inputs', () => {
    renderWithProviders(<NewRepairRequestPage />)

    expect(screen.getByText(/1. Select Device Type/i)).toBeInTheDocument()
    expect(screen.getByText(/Smartphone/i)).toBeInTheDocument()
    expect(screen.getByText(/Laptop/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Brand \/ Manufacturer/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Model Name \/ Number/i)).toBeInTheDocument()
    expect(
      screen.getByLabelText(/Detailed Problem Description/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Submit Request/i }),
    ).toBeInTheDocument()
  })
})
