import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import {
  customerRepairsQueryKey,
  marketplaceFeedQueryKey,
  repairQuotationQueryKey,
  type QuotationItem,
  type RepairItem,
} from '@/features/repairs/api/repairsApi'
import { CustomerDashboardPage } from '@/pages/CustomerDashboardPage'
import { NewRepairRequestPage } from '@/pages/NewRepairRequestPage'
import { VendorMarketplacePage } from '@/pages/VendorMarketplacePage'
import { RepairQuotationSection } from '@/features/repairs/components/RepairQuotationSection'

function renderWithProviders(
  ui: React.ReactElement,
  initialRepairs = [],
  initialMarketplace = [],
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  // Seed cache so components render immediately
  queryClient.setQueryData(customerRepairsQueryKey, initialRepairs)
  queryClient.setQueryData(marketplaceFeedQueryKey({}), initialMarketplace)

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

  it('renders Vendor Marketplace feed with categories and empty state', () => {
    renderWithProviders(<VendorMarketplacePage />, [], [])

    expect(
      screen.getByRole('heading', { level: 1, name: /Open Repair Requests/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Vendor Marketplace/i)).toBeInTheDocument()
    expect(screen.getByText(/All Devices/i)).toBeInTheDocument()
    expect(screen.getByText(/Phones/i)).toBeInTheDocument()
    expect(screen.getByText(/Laptops/i)).toBeInTheDocument()
    expect(screen.getByText(/No Open Repair Requests/i)).toBeInTheDocument()
  })

  it('renders technician bench and line items when assigned vendor visits ticket', () => {
    const mockRepair: RepairItem = {
      id: 'rep-123',
      customerId: 'cust-1',
      deviceType: 'phone',
      brand: 'Apple',
      modelName: 'iPhone 15',
      issueCategory: 'screen',
      description: 'Cracked screen after drop.',
      images: [],
      urgency: 'high',
      status: 'vendor_selected',
      assignedVendorId: 'vend-1',
      assignedVendorName: 'Apex Tech',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    queryClient.setQueryData(repairQuotationQueryKey('rep-123'), null)

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RepairQuotationSection
            repair={mockRepair}
            userRole="vendor"
            userId="vend-1"
          />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(
      screen.getByText(/Technician Physical Inspection Bench/i),
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/OLED digitizer damaged/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Submit Official Quotation to Customer/i }),
    ).toBeInTheDocument()
  })

  it('renders customer receipt table with authorization buttons when quotation is submitted', () => {
    const mockRepair: RepairItem = {
      id: 'rep-456',
      customerId: 'cust-1',
      deviceType: 'laptop',
      brand: 'Dell',
      modelName: 'XPS 15',
      issueCategory: 'hardware',
      description: 'Power port issue.',
      images: [],
      urgency: 'medium',
      status: 'diagnosed',
      assignedVendorId: 'vend-1',
      assignedVendorName: 'Apex Tech',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const mockQuotation: QuotationItem = {
      id: 'quote-1',
      repairRequestId: 'rep-456',
      vendorId: 'vend-1',
      vendorName: 'Apex Tech',
      diagnosticFindings: 'Internal DC jack burnt out. Motherboard fuses in good health.',
      lineItems: [
        { description: 'OEM DC Charging Jack Replacement', category: 'parts', cost: 45 },
        { description: 'Precision Soldering & Testing Labor', category: 'labor', cost: 60 },
      ],
      totalAmount: 105,
      estimatedCompletion: '24 Hours',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    queryClient.setQueryData(repairQuotationQueryKey('rep-456'), mockQuotation)

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RepairQuotationSection
            repair={mockRepair}
            userRole="customer"
            userId="cust-1"
          />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(
      screen.getByText(/Physical Diagnosis & Itemized Quotation/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Internal DC jack burnt out/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/OEM DC Charging Jack Replacement/i),
    ).toBeInTheDocument()
    expect(screen.getByText('$105.00')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Approve & Authorize Repair/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Decline Quote/i }),
    ).toBeInTheDocument()
  })
})
