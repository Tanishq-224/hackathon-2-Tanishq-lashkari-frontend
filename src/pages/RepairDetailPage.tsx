import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Cpu,
  Headphones,
  Laptop,
  ShieldCheck,
  Smartphone,
  Tablet,
  Watch,
  X,
} from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import {
  fetchRepairDetails,
  repairDetailQueryKey,
  type DeviceType,
} from '@/features/repairs/api/repairsApi'
import { RepairEstimatesSection } from '@/features/repairs/components/RepairEstimatesSection'
import { RepairLifecycleTimeline } from '@/features/repairs/components/RepairLifecycleTimeline'
import { RepairCompletionSection } from '@/features/repairs/components/RepairCompletionSection'
import { RepairQuotationSection } from '@/features/repairs/components/RepairQuotationSection'
import { useAuthSession } from '@/hooks/useAuthSession'
import { useRepairRealtimeSubscription } from '@/hooks/useRepairRealtimeSubscription'
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

export function RepairDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { user } = useAuthSession()
  useRepairRealtimeSubscription(id)

  const {
    data: repair,
    isLoading,
    error,
  } = useQuery({
    queryKey: repairDetailQueryKey(id || ''),
    queryFn: () => fetchRepairDetails(id || ''),
    enabled: Boolean(id),
  })

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-ui text-muted-foreground">Loading repair details...</p>
        </div>
      </div>
    )
  }

  if (error || !repair) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
        <h3 className="mt-2 text-h3 font-semibold text-foreground">
          Repair Request Not Found
        </h3>
        <p className="mt-1 text-ui text-muted-foreground">
          The requested repair ticket does not exist or you do not have permission to view it.
        </p>
        <Link
          to="/dashboard"
          className={buttonVariants({ variant: 'outline', className: 'mt-4' })}
        >
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const DeviceIcon = getDeviceIcon(repair.deviceType)
  return (
    <div className="mx-auto max-w-4xl space-y-5 sm:space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-ui font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Requests</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6 md:flex-row md:items-center">
        <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-14 sm:w-14">
            <DeviceIcon className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-xl font-bold leading-tight tracking-tight text-foreground break-words sm:text-h2">
                {repair.brand} {repair.modelName}
              </h1>
              <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground sm:px-2.5 sm:text-caption">
                {repair.deviceType}
              </span>
            </div>
            <p className="mt-1 text-caption capitalize text-muted-foreground sm:text-ui">
              Issue: {repair.issueCategory.replace('_', ' ')} • Urgency: {repair.urgency}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-1 border-t border-border pt-3 text-caption text-muted-foreground md:border-t-0 md:pt-0 md:items-end">
          <span>Ticket ID: {repair.id.slice(0, 12)}</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(repair.createdAt).toLocaleDateString(undefined, {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      <RepairLifecycleTimeline status={repair.status} />

      {/* Problem Description & Attached Photos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-h3 font-semibold text-foreground">
              Reported Symptoms & Details
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-ui leading-relaxed text-foreground/90">
              {repair.description}
            </p>
          </div>

          {repair.images.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-display text-h3 font-semibold text-foreground">
                Attached Damage Photos ({repair.images.length})
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {repair.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(img.url)}
                    className="group relative aspect-video overflow-hidden rounded-lg border border-border bg-secondary/40 transition hover:border-primary/60 hover:opacity-95"
                  >
                    <img
                      src={img.url}
                      alt={`Damage photo ${i + 1}`}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                      <span className="rounded-md bg-black/70 px-2 py-1 text-[11px] font-medium text-white">
                        Click to view
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Technician Estimates & Proposals */}
          <RepairEstimatesSection
            repair={repair}
            userRole={user?.role}
            userId={user?.id}
          />

          {/* Physical Diagnosis & Itemized Quotation Approval */}
          <RepairQuotationSection
            repair={repair}
            userRole={user?.role}
            userId={user?.id}
          />

          <RepairCompletionSection
            repair={repair}
            userRole={user?.role}
            userId={user?.id}
          />
        </div>

        {/* Right Sidebar: What Happens Next */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2.5 text-primary">
              <ShieldCheck className="h-5 w-5" />
              <h3 className="font-display text-base font-semibold text-foreground">
                What Happens Next?
              </h3>
            </div>
            <ul className="mt-4 space-y-3 text-ui text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  Technicians review your device details and submit preliminary estimates.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  You compare pricing and reviews, then approve a technician to inspect the device.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  Final quotation with parts & labor is agreed before any physical repair begins.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lightbox / Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Damage inspection zoom"
              className="max-h-[85vh] rounded-xl object-contain shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:scale-110"
              aria-label="Close image"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
