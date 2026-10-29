import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
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
  type RepairStatus,
} from '@/features/repairs/api/repairsApi'
import { RepairEstimatesSection } from '@/features/repairs/components/RepairEstimatesSection'
import { RepairQuotationSection } from '@/features/repairs/components/RepairQuotationSection'
import { useAuthSession } from '@/hooks/useAuthSession'
import { useQuery } from '@tanstack/react-query'

const WORKFLOW_STEPS: { status: RepairStatus; label: string }[] = [
  { status: 'submitted', label: 'Request Submitted' },
  { status: 'estimated', label: 'Estimates Received' },
  { status: 'vendor_selected', label: 'Vendor Assigned' },
  { status: 'diagnosed', label: 'Diagnosis Completed' },
  { status: 'quote_approved', label: 'Quote Approved' },
  { status: 'in_repair', label: 'In Repair' },
  { status: 'completed', label: 'Completed' },
]

function getStepIndex(status: RepairStatus): number {
  switch (status) {
    case 'submitted':
      return 0
    case 'estimated':
      return 1
    case 'vendor_selected':
      return 2
    case 'diagnosed':
      return 3
    case 'quote_approved':
      return 4
    case 'in_repair':
      return 5
    case 'ready_for_pickup':
    case 'completed':
      return 6
    case 'cancelled':
      return -1
    default:
      return 0
  }
}

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
  const currentStep = getStepIndex(repair.status)

  return (
    <div className="mx-auto max-w-4xl space-y-8">
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
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <DeviceIcon className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-h2 font-bold tracking-tight text-foreground">
                {repair.brand} {repair.modelName}
              </h1>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-caption font-semibold uppercase text-muted-foreground">
                {repair.deviceType}
              </span>
            </div>
            <p className="mt-1 text-ui capitalize text-muted-foreground">
              Issue: {repair.issueCategory.replace('_', ' ')} • Urgency: {repair.urgency}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-1 text-caption text-muted-foreground md:items-end">
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

      {/* Progress Timeline Tracker */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-display text-ui font-semibold uppercase tracking-wider text-muted-foreground">
          Repair Lifecycle Status
        </h2>

        <div className="mt-6">
          <div className="hidden grid-cols-7 gap-2 md:grid">
            {WORKFLOW_STEPS.map((step, idx) => {
              const isPast = idx < currentStep
              const isCurrent = idx === currentStep
              return (
                <div key={step.status} className="flex flex-col items-center text-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-caption font-bold transition ${
                      isPast
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : isCurrent
                          ? 'border-primary bg-primary text-primary-foreground shadow-sm ring-4 ring-primary/20'
                          : 'border-border bg-secondary text-muted-foreground'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                  </div>
                  <span
                    className={`mt-2 text-[11px] font-medium leading-tight ${
                      isCurrent
                        ? 'font-bold text-primary'
                        : isPast
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Mobile Current Status Pill */}
          <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3 md:hidden">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-ui font-medium text-foreground">Current Stage:</span>
            </div>
            <span className="rounded-full bg-primary/15 px-3 py-0.5 text-ui font-bold text-primary">
              {WORKFLOW_STEPS[currentStep]?.label || repair.status}
            </span>
          </div>
        </div>
      </div>

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
