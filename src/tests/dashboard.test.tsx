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
import { AppToastProvider } from '@/components/shared/AppToastProvider'
import { RepairCompletionSection } from '@/features/repairs/components/RepairCompletionSection'
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
      <AppToastProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </AppToastProvider>
    </QueryClientProvider>,
  )
}

function renderRepairSection(
  ui: React.ReactElement,
  queryClient: QueryClient,
) {
  return render(
    <QueryClientProvider client={queryClient}>
      <AppToastProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </AppToastProvider>
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

    renderRepairSection(
      <RepairQuotationSection
        repair={mockRepair}
        userRole="vendor"
        userId="vend-1"
      />,
      queryClient,
    )

    expect(
      screen.getByText(/Technician Physical Inspection Bench/i),
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/OLED digitizer damaged/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Submit official quotation to customer/i }),
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

    renderRepairSection(
      <RepairQuotationSection
        repair={mockRepair}
        userRole="customer"
        userId="cust-1"
      />,
      queryClient,
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

  it('does not show authorization buttons for admin (API is customer-only)', () => {
    const mockRepair: RepairItem = {
      id: 'rep-admin',
      customerId: 'cust-1',
      deviceType: 'phone',
      brand: 'Apple',
      modelName: 'iPhone 14',
      issueCategory: 'screen',
      description: 'Cracked display.',
      images: [],
      urgency: 'medium',
      status: 'diagnosed',
      assignedVendorId: 'vend-1',
      assignedVendorName: 'Apex Tech',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const mockQuotation: QuotationItem = {
      id: 'quote-admin',
      repairRequestId: 'rep-admin',
      vendorId: 'vend-1',
      vendorName: 'Apex Tech',
      diagnosticFindings: 'Display assembly requires replacement.',
      lineItems: [{ description: 'OLED panel', category: 'parts', cost: 180 }],
      totalAmount: 180,
      estimatedCompletion: '2 Days',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    queryClient.setQueryData(repairQuotationQueryKey('rep-admin'), mockQuotation)

    renderRepairSection(
      <RepairQuotationSection
        repair={mockRepair}
        userRole="admin"
        userId="admin-1"
      />,
      queryClient,
    )

    expect(
      screen.queryByRole('button', { name: /Approve & Authorize Repair/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByText(/awaiting approval from the customer/i),
    ).toBeInTheDocument()
  })

  it('formats string line-item costs without crashing', () => {
    const mockRepair: RepairItem = {
      id: 'rep-str',
      customerId: 'cust-1',
      deviceType: 'tablet',
      brand: 'Apple',
      modelName: 'iPad Air',
      issueCategory: 'hardware',
      description: 'No charge.',
      images: [],
      urgency: 'low',
      status: 'diagnosed',
      assignedVendorId: 'vend-1',
      assignedVendorName: 'Apex Tech',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const mockQuotation = {
      id: 'quote-str',
      repairRequestId: 'rep-str',
      vendorId: 'vend-1',
      vendorName: 'Apex Tech',
      diagnosticFindings: 'Port wear observed under microscope.',
      lineItems: [
        { description: 'USB-C port', category: 'parts' as const, cost: '55.5' as unknown as number },
      ],
      totalAmount: '55.5' as unknown as number,
      estimatedCompletion: '1 Day',
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    queryClient.setQueryData(repairQuotationQueryKey('rep-str'), mockQuotation)

    renderRepairSection(
      <RepairQuotationSection
        repair={mockRepair}
        userRole="customer"
        userId="cust-1"
      />,
      queryClient,
    )

    expect(screen.getAllByText('$55.50').length).toBeGreaterThan(0)
  })

  it('renders vendor start repair action when quote is approved', () => {
    const mockRepair: RepairItem = {
      id: 'rep-789',
      customerId: 'cust-1',
      deviceType: 'phone',
      brand: 'Samsung',
      modelName: 'Galaxy S24',
      issueCategory: 'screen',
      description: 'Display lines after impact.',
      images: [{ url: 'https://example.com/before.jpg' }],
      urgency: 'high',
      status: 'quote_approved',
      assignedVendorId: 'vend-1',
      assignedVendorName: 'Apex Tech',
      finalApprovedAmount: 220,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    renderRepairSection(
      <RepairCompletionSection
        repair={mockRepair}
        userRole="vendor"
        userId="vend-1"
      />,
      queryClient,
    )

    expect(screen.getByText(/Repair Execution & Completion/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Start Repair Work/i }),
    ).toBeInTheDocument()
  })

  it('mounts completion section after status advances to quote_approved (post-approval)', () => {
    const diagnosedRepair: RepairItem = {
      id: 'rep-lifecycle',
      customerId: 'cust-1',
      deviceType: 'phone',
      brand: 'Google',
      modelName: 'Pixel 8',
      issueCategory: 'battery',
      description: 'Battery drains quickly.',
      images: [],
      urgency: 'medium',
      status: 'diagnosed',
      assignedVendorId: 'vend-1',
      assignedVendorName: 'Apex Tech',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const approvedRepair: RepairItem = {
      ...diagnosedRepair,
      status: 'quote_approved',
      finalApprovedAmount: 149,
    }

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    const { rerender } = renderRepairSection(
      <RepairCompletionSection
        repair={diagnosedRepair}
        userRole="vendor"
        userId="vend-1"
      />,
      queryClient,
    )

    expect(
      screen.queryByText(/Repair Execution & Completion/i),
    ).not.toBeInTheDocument()

    rerender(
      <QueryClientProvider client={queryClient}>
        <AppToastProvider>
          <MemoryRouter>
            <RepairCompletionSection
              repair={approvedRepair}
              userRole="vendor"
              userId="vend-1"
            />
          </MemoryRouter>
        </AppToastProvider>
      </QueryClientProvider>,
    )

    expect(screen.getByText(/Repair Execution & Completion/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Start Repair Work/i }),
    ).toBeInTheDocument()
  })
})
