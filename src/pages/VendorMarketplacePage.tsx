import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  Cpu,
  Filter,
  Headphones,
  Laptop,
  Loader2,
  Send,
  Smartphone,
  Store,
  Tablet,
  Watch,
  X,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  fetchMarketplaceFeed,
  marketplaceFeedQueryKey,
  repairDetailQueryKey,
  repairEstimatesQueryKey,
  submitEstimateRequest,
  type DeviceType,
  type RepairItem,
  type Urgency,
} from '@/features/repairs/api/repairsApi'
import { getApiErrorMessage } from '@/lib/api-client'
import { cn } from '@/lib/utils'

const DEVICE_FILTERS: { type: DeviceType | 'all'; label: string; icon: typeof Smartphone }[] = [
  { type: 'all', label: 'All Devices', icon: Store },
  { type: 'phone', label: 'Phones', icon: Smartphone },
  { type: 'laptop', label: 'Laptops', icon: Laptop },
  { type: 'tablet', label: 'Tablets', icon: Tablet },
  { type: 'audio', label: 'Audio', icon: Headphones },
  { type: 'smartwatch', label: 'Watches', icon: Watch },
  { type: 'other', label: 'Other', icon: Cpu },
]

function getDeviceIcon(deviceType: DeviceType) {
  switch (deviceType) {
    case 'phone':
      return Smartphone
    case 'laptop':
      return Laptop
    case 'tablet':
      return Tablet
    case 'audio':
      return Headphones
    case 'smartwatch':
      return Watch
    default:
      return Cpu
  }
}

function getUrgencyBadge(urgency: Urgency) {
  switch (urgency) {
    case 'immediate':
      return {
        label: 'Urgent (Same-Day)',
        className: 'bg-destructive/15 text-destructive border-destructive/20',
      }
    case 'high':
      return {
        label: 'Priority (24-48h)',
        className: 'bg-amber-500/15 text-amber-500 border-amber-500/20',
      }
    case 'medium':
      return {
        label: 'Standard (2-4d)',
        className: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
      }
    case 'low':
      return {
        label: 'Flexible',
        className: 'bg-secondary text-muted-foreground border-border',
      }
  }
}

export function VendorMarketplacePage() {
  const queryClient = useQueryClient()
  const [selectedDevice, setSelectedDevice] = useState<DeviceType | 'all'>('all')
  const [selectedUrgency, setSelectedUrgency] = useState<Urgency | 'all'>('all')
  const [activeModalRepair, setActiveModalRepair] = useState<RepairItem | null>(null)

  // Estimate modal form fields
  const [minCost, setMinCost] = useState('')
  const [maxCost, setMaxCost] = useState('')
  const [turnaroundTime, setTurnaroundTime] = useState('24 Hours')
  const [warrantyMonths, setWarrantyMonths] = useState('6')
  const [notes, setNotes] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [successBanner, setSuccessBanner] = useState<string | null>(null)

  const filters = {
    ...(selectedDevice !== 'all' ? { deviceType: selectedDevice } : {}),
    ...(selectedUrgency !== 'all' ? { urgency: selectedUrgency } : {}),
  }

  const { data: requests = [], isLoading, error } = useQuery({
    queryKey: marketplaceFeedQueryKey(filters),
    queryFn: () => fetchMarketplaceFeed(filters),
  })

  const submitMutation = useMutation({
    mutationFn: ({
      repairId,
      payload,
    }: {
      repairId: string
      payload: {
        minCost: number
        maxCost: number
        turnaroundTime: string
        warrantyMonths: number
        notes: string
      }
    }) => submitEstimateRequest(repairId, payload),
    onSuccess: (_, variables) => {
      setSuccessBanner('Your proposal has been submitted to the customer!')
      setActiveModalRepair(null)
      setMinCost('')
      setMaxCost('')
      setNotes('')
      void queryClient.invalidateQueries({ queryKey: ['marketplace'] })
      void queryClient.invalidateQueries({ queryKey: repairDetailQueryKey(variables.repairId) })
      void queryClient.invalidateQueries({
        queryKey: repairEstimatesQueryKey(variables.repairId),
      })
    },
    onError: (err) => {
      setFormError(getApiErrorMessage(err))
    },
  })

  function handleOpenEstimateModal(repair: RepairItem) {
    setActiveModalRepair(repair)
    setFormError(null)
    setMinCost(repair.estimatedBudgetMin ? String(repair.estimatedBudgetMin) : '')
    setMaxCost(repair.estimatedBudgetMax ? String(repair.estimatedBudgetMax) : '')
    setTurnaroundTime('24 Hours')
    setWarrantyMonths('6')
    setNotes('')
  }

  function handleModalSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!activeModalRepair) return
    setFormError(null)

    const min = parseFloat(minCost)
    const max = parseFloat(maxCost)
    const warranty = parseInt(warrantyMonths, 10)

    if (isNaN(min) || min <= 0) {
      setFormError('Please enter a valid minimum estimated price.')
      return
    }
    if (isNaN(max) || max < min) {
      setFormError('Maximum price must be greater than or equal to minimum price.')
      return
    }
    if (!turnaroundTime.trim()) {
      setFormError('Please specify an estimated turnaround time.')
      return
    }
    if (notes.trim().length < 5) {
      setFormError('Please provide a brief notes description (min 5 characters).')
      return
    }

    submitMutation.mutate({
      repairId: activeModalRepair.id,
      payload: {
        minCost: min,
        maxCost: max,
        turnaroundTime: turnaroundTime.trim(),
        warrantyMonths: isNaN(warranty) ? 3 : warranty,
        notes: notes.trim(),
      },
    })
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-primary">
          <Store className="h-5 w-5" />
          <span className="text-caption font-semibold uppercase tracking-wider">
            Vendor Marketplace
          </span>
        </div>
        <h1 className="mt-1 font-display text-h2 font-bold tracking-tight text-foreground">
          Open Repair Requests
        </h1>
        <p className="mt-1 text-ui text-muted-foreground">
          Browse customer repair requests seeking estimates. Review reported symptoms and submit preliminary pricing.
        </p>
      </div>

      {successBanner && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-ui text-emerald-400">
          {successBanner}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Device Categories */}
        <div className="flex flex-wrap gap-1.5">
          {DEVICE_FILTERS.map((cat) => {
            const Icon = cat.icon
            const isSelected = selectedDevice === cat.type
            return (
              <button
                key={cat.type}
                type="button"
                onClick={() => setSelectedDevice(cat.type)}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-caption font-medium transition',
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Urgency Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value as Urgency | 'all')}
            className="rounded-xl border border-border bg-card px-3 py-1.5 text-caption font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Filter by urgency"
          >
            <option value="all">All Urgencies</option>
            <option value="immediate">Urgent (Same-Day)</option>
            <option value="high">Priority (24-48h)</option>
            <option value="medium">Standard (2-4d)</option>
            <option value="low">Flexible</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-ui text-muted-foreground">Loading open marketplace tickets...</p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-destructive">
          <AlertCircle className="mx-auto h-6 w-6" />
          <p className="mt-2 text-ui">Failed to load marketplace tickets. Please refresh the page.</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <Store className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-display text-h3 font-semibold text-foreground">
            No Open Repair Requests
          </h3>
          <p className="mt-2 text-ui text-muted-foreground">
            There are currently no open tickets matching your selected filters. Check back soon for new customer submissions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((repair: RepairItem) => {
            const DeviceIcon = getDeviceIcon(repair.deviceType)
            const urgency = getUrgencyBadge(repair.urgency)

            return (
              <div
                key={repair.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/50 hover:shadow-md"
              >
                <div className="space-y-4">
                  {/* Top Bar: Icon + Urgency */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <DeviceIcon className="size-6" />
                    </div>
                    <span
                      className={cn(
                        'rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
                        urgency.className,
                      )}
                    >
                      {urgency.label}
                    </span>
                  </div>

                  {/* Device Info */}
                  <div>
                    <h3 className="font-display text-h3 font-bold text-foreground">
                      {repair.brand} {repair.modelName}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium capitalize text-secondary-foreground">
                        {repair.issueCategory.replace('_', ' ')}
                      </span>
                      <span className="text-caption text-muted-foreground">
                        Status: <strong className="capitalize text-foreground">{repair.status.replace('_', ' ')}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Description Excerpt */}
                  <p className="line-clamp-3 text-ui leading-relaxed text-muted-foreground">
                    {repair.description}
                  </p>

                  {/* Damage photos thumbnail strip */}
                  {repair.images.length > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      {repair.images.slice(0, 3).map((img, i) => (
                        <img
                          key={i}
                          src={img.url}
                          alt="Damage thumbnail"
                          className="size-12 rounded-lg border border-border object-cover"
                        />
                      ))}
                      {repair.images.length > 3 && (
                        <div className="flex size-12 items-center justify-center rounded-lg border border-border bg-secondary text-[11px] font-bold text-muted-foreground">
                          +{repair.images.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="mt-6 flex items-center gap-2 border-t border-border pt-4">
                  <Button
                    size="sm"
                    onClick={() => handleOpenEstimateModal(repair)}
                    className="flex-1"
                  >
                    Submit Estimate
                  </Button>
                  <Link
                    to={`/dashboard/repairs/${repair.id}`}
                    className={cn(
                      buttonVariants({ variant: 'outline', size: 'sm' }),
                      'px-3',
                    )}
                    title="View details"
                  >
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal Dialog for Submitting Estimate */}
      {activeModalRepair && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setActiveModalRepair(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveModalRepair(null)}
              className="absolute right-4 top-4 text-muted-foreground transition hover:text-foreground"
              aria-label="Close modal"
            >
              <X className="size-5" />
            </button>

            <div className="space-y-1">
              <span className="text-caption font-semibold uppercase tracking-wider text-primary">
                Preliminary Proposal
              </span>
              <h2 className="font-display text-h3 font-bold text-foreground">
                Submit Estimate for {activeModalRepair.brand} {activeModalRepair.modelName}
              </h2>
              <p className="text-caption text-muted-foreground">
                Issue: <span className="capitalize">{activeModalRepair.issueCategory.replace('_', ' ')}</span>
              </p>
            </div>

            {formError && (
              <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-caption text-destructive">
                {formError}
              </div>
            )}

            <form onSubmit={handleModalSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-caption font-medium text-foreground">
                    Min Price ($) *
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      min="1"
                      value={minCost}
                      onChange={(e) => setMinCost(e.target.value)}
                      placeholder="75"
                      className="pl-7"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-caption font-medium text-foreground">
                    Max Price ($) *
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      min="1"
                      value={maxCost}
                      onChange={(e) => setMaxCost(e.target.value)}
                      placeholder="110"
                      className="pl-7"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-caption font-medium text-foreground">
                    Estimated Turnaround *
                  </label>
                  <Input
                    type="text"
                    value={turnaroundTime}
                    onChange={(e) => setTurnaroundTime(e.target.value)}
                    placeholder="e.g. 24 Hours, 2 Days"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="text-caption font-medium text-foreground">
                    Warranty (Months)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="60"
                    value={warrantyMonths}
                    onChange={(e) => setWarrantyMonths(e.target.value)}
                    placeholder="6"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-caption font-medium text-foreground">
                  Repair Plan & Notes *
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Describe parts, labor, diagnostic steps, or warranty terms..."
                  className="mt-1 w-full rounded-xl border border-input bg-background p-3 text-ui text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveModalRepair(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitMutation.isPending}>
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      <span>Submit Proposal</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
