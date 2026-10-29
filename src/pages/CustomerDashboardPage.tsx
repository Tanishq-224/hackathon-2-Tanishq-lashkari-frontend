import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Cpu,
  Headphones,
  Laptop,
  PlusCircle,
  Smartphone,
  Tablet,
  Watch,
  Wrench,
} from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import {
  customerRepairsQueryKey,
  fetchMyRepairRequests,
  vendorRepairsQueryKey,
  type DeviceType,
  type RepairStatus,
} from '@/features/repairs/api/repairsApi'
import { useAuthSession } from '@/hooks/useAuthSession'
import { useQuery } from '@tanstack/react-query'

function getDeviceIcon(type: DeviceType) {
  switch (type) {
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

function getStatusBadge(status: RepairStatus) {
  switch (status) {
    case 'submitted':
      return {
        label: 'Submitted (Awaiting Estimates)',
        className: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
      }
    case 'estimated':
      return {
        label: 'Estimates Received',
        className: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      }
    case 'vendor_selected':
      return {
        label: 'Vendor Selected',
        className: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      }
    case 'diagnosed':
      return {
        label: 'Diagnosed',
        className: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      }
    case 'quote_approved':
      return {
        label: 'Quote Approved',
        className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      }
    case 'in_repair':
      return {
        label: 'In Repair',
        className: 'bg-primary/15 text-primary border-primary/30',
      }
    case 'ready_for_pickup':
      return {
        label: 'Ready for Pickup',
        className: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
      }
    case 'completed':
      return {
        label: 'Completed',
        className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      }
    case 'cancelled':
      return {
        label: 'Cancelled',
        className: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      }
    default:
      return {
        label: status,
        className: 'bg-secondary text-muted-foreground border-border',
      }
  }
}

export function CustomerDashboardPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const { user } = useAuthSession()
  const isVendor = user?.role === 'vendor'

  const { data: repairs = [], isLoading, error } = useQuery({
    queryKey: isVendor ? vendorRepairsQueryKey : customerRepairsQueryKey,
    queryFn: fetchMyRepairRequests,
    enabled: Boolean(user),
  })

  const activeRepairs = repairs.filter(
    (r) => r.status !== 'completed' && r.status !== 'cancelled',
  )
  const completedRepairs = repairs.filter((r) => r.status === 'completed')

  const filteredRepairs =
    filter === 'active'
      ? activeRepairs
      : filter === 'completed'
        ? completedRepairs
        : repairs

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-ui text-muted-foreground">Loading repair requests...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
        <h3 className="mt-2 text-h3 font-semibold text-foreground">Failed to load requests</h3>
        <p className="mt-1 text-ui text-muted-foreground">
          There was an error communicating with the Repairex server.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Title & Action */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-h2 font-bold tracking-tight text-foreground">
            {isVendor ? 'Assigned Repairs' : 'Repair Requests'}
          </h1>
          <p className="text-ui text-muted-foreground">
            {isVendor
              ? 'Tickets where you were selected — run diagnosis, quotations, and repair work.'
              : 'Manage your electronics repair tickets, estimates, and repair progress.'}
          </p>
        </div>

        {!isVendor && (
          <Link
            to="/dashboard/new-repair"
            className={buttonVariants({ className: 'gap-2 shadow-sm' })}
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Repair Request</span>
          </Link>
        )}
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-ui font-medium text-muted-foreground">Total Requests</span>
            <div className="rounded-lg bg-secondary p-2 text-foreground">
              <Wrench className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-foreground">
            {repairs.length}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-ui font-medium text-muted-foreground">Active in Progress</span>
            <div className="rounded-lg bg-primary/15 p-2 text-primary">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-primary">
            {activeRepairs.length}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-ui font-medium text-muted-foreground">Completed</span>
            <div className="rounded-lg bg-emerald-500/15 p-2 text-emerald-500">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-emerald-500">
            {completedRepairs.length}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        {(['all', 'active', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`rounded-lg px-3.5 py-1.5 text-ui font-medium capitalize transition ${
              filter === tab
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
            }`}
          >
            {tab} ({tab === 'all' ? repairs.length : tab === 'active' ? activeRepairs.length : completedRepairs.length})
          </button>
        ))}
      </div>

      {/* Repair Requests List */}
      {filteredRepairs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <Wrench className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-display text-h3 font-semibold text-foreground">
            {isVendor
              ? filter === 'all'
                ? 'No assigned repairs yet'
                : `No ${filter} assigned jobs`
              : filter === 'all'
                ? 'No repair requests submitted yet'
                : `No ${filter} requests`}
          </h3>
          <p className="mt-1.5 max-w-sm text-ui text-muted-foreground">
            {isVendor
              ? 'When a customer accepts your marketplace estimate, the ticket appears here for diagnosis and repair.'
              : 'Submit a device repair ticket with issue photos to compare quotes from certified repair specialists.'}
          </p>
          {!isVendor && filter === 'all' && (
            <Link
              to="/dashboard/new-repair"
              className={buttonVariants({ className: 'mt-6 gap-2' })}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Your First Request</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredRepairs.map((repair) => {
            const Icon = getDeviceIcon(repair.deviceType)
            const badge = getStatusBadge(repair.status)

            return (
              <div
                key={repair.id}
                className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground group-hover:text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-display text-base font-semibold text-foreground">
                          {repair.brand} {repair.modelName}
                        </h4>
                        <p className="text-caption capitalize text-muted-foreground">
                          {repair.deviceType} • {repair.issueCategory.replace('_', ' ')}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-caption font-semibold ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <p className="line-clamp-2 text-ui text-muted-foreground">
                    {repair.description}
                  </p>

                  {repair.images.length > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      {repair.images.slice(0, 3).map((img, i) => (
                        <img
                          key={i}
                          src={img.url}
                          alt={`Attachment ${i + 1}`}
                          className="h-10 w-10 rounded-md border border-border object-cover"
                        />
                      ))}
                      {repair.images.length > 3 && (
                        <span className="text-caption text-muted-foreground">
                          +{repair.images.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-caption text-muted-foreground">
                    {new Date(repair.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>

                  <Link
                    to={`/dashboard/repairs/${repair.id}`}
                    className="inline-flex items-center gap-1.5 text-ui font-medium text-primary transition group-hover:underline"
                  >
                    <span>View Request</span>
                    <ArrowRight className="h-3.5 w-3.5" />
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
