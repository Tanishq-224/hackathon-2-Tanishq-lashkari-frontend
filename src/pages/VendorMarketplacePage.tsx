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
  Smartphone,
  Store,
  Tablet,
  Watch,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { buttonVariants } from '@/components/ui/button'
import {
  fetchMarketplaceFeed,
  marketplaceFeedQueryKey,
  type DeviceType,
  type RepairItem,
  type Urgency,
} from '@/features/repairs/api/repairsApi'
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
  const [selectedDevice, setSelectedDevice] = useState<DeviceType | 'all'>('all')
  const [selectedUrgency, setSelectedUrgency] = useState<Urgency | 'all'>('all')

  const filters = {
    ...(selectedDevice !== 'all' ? { deviceType: selectedDevice } : {}),
    ...(selectedUrgency !== 'all' ? { urgency: selectedUrgency } : {}),
  }

  const { data: requests = [], isLoading, error } = useQuery({
    queryKey: marketplaceFeedQueryKey(filters),
    queryFn: () => fetchMarketplaceFeed(filters),
  })

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
                  <Link
                    to={`/dashboard/marketplace/${repair.id}/estimate`}
                    className={cn(buttonVariants({ size: 'sm' }), 'flex-1')}
                  >
                    Open estimate form
                  </Link>
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

    </div>
  )
}
