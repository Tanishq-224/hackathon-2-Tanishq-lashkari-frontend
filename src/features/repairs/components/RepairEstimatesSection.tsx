import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle,
  ChevronRight,
  Clock,
  Loader2,
  Pencil,
  ShieldCheck,
  Store,
  UserCheck,
  XCircle,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  fetchRepairEstimates,
  rejectEstimateRequest,
  repairDetailQueryKey,
  repairEstimatesQueryKey,
  selectEstimateRequest,
  withdrawEstimateRequest,
  type EstimateItem,
  type RepairItem,
} from '@/features/repairs/api/repairsApi'
import {
  estimateStatusLabel,
  isEstimateActionable,
} from '@/features/repairs/lib/estimate-status'
import { useAppToast } from '@/components/shared/AppToastProvider'
import { getApiErrorMessage } from '@/lib/api-client'
import { formatUsd } from '@/lib/format-money'
import { cn } from '@/lib/utils'

type RepairEstimatesSectionProps = {
  repair: RepairItem
  userRole?: 'customer' | 'vendor' | 'admin'
  userId?: string
}

function estimateTotalLabel(estimate: EstimateItem): string {
  const hasBreakdown = estimate.componentLines && estimate.componentLines.length > 0
  if (hasBreakdown) {
    const parts = estimate.componentLines!.reduce((sum, line) => sum + line.price, 0)
    const total = parts + (estimate.labourCost ?? 0)
    return formatUsd(total)
  }
  if (estimate.minCost === estimate.maxCost) {
    return formatUsd(estimate.minCost)
  }
  return `${formatUsd(estimate.minCost)} – ${formatUsd(estimate.maxCost)}`
}

export function RepairEstimatesSection({
  repair,
  userRole,
  userId,
}: RepairEstimatesSectionProps) {
  const queryClient = useQueryClient()
  const { pushError, pushSuccess } = useAppToast()
  const [, setSuccessMessage] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const { data: estimates = [], isLoading } = useQuery({
    queryKey: repairEstimatesQueryKey(repair.id),
    queryFn: () => fetchRepairEstimates(repair.id),
  })

  const selectMutation = useMutation({
    mutationFn: (estimateId: string) => selectEstimateRequest(repair.id, estimateId),
    onSuccess: () => {
      setSuccessMessage('Estimate accepted! The technician has been assigned to your repair.')
      pushSuccess('Technician assigned to this repair.')
      void queryClient.invalidateQueries({ queryKey: repairDetailQueryKey(repair.id) })
      void queryClient.invalidateQueries({ queryKey: repairEstimatesQueryKey(repair.id) })
    },
    onError: (err) => {
      pushError(getApiErrorMessage(err))
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ estimateId, reason }: { estimateId: string; reason?: string }) =>
      rejectEstimateRequest(repair.id, estimateId, reason),
    onSuccess: () => {
      pushSuccess('Estimate rejected.')
      setRejectingId(null)
      setRejectReason('')
      void queryClient.invalidateQueries({ queryKey: repairEstimatesQueryKey(repair.id) })
    },
    onError: (err) => pushError(getApiErrorMessage(err)),
  })

  const withdrawMutation = useMutation({
    mutationFn: (estimateId: string) => withdrawEstimateRequest(repair.id, estimateId),
    onSuccess: () => {
      pushSuccess('Your estimate was withdrawn.')
      void queryClient.invalidateQueries({ queryKey: repairEstimatesQueryKey(repair.id) })
      void queryClient.invalidateQueries({ queryKey: ['marketplace'] })
    },
    onError: (err) => pushError(getApiErrorMessage(err)),
  })

  const isCustomerOwner = userRole === 'customer'
  const isVendor = userRole === 'vendor'
  const myActiveEstimate = estimates.find(
    (e) => e.vendorId === userId && (e.status === 'pending' || e.status === 'accepted'),
  )
  const canVendorSubmit =
    isVendor &&
    !myActiveEstimate &&
    (repair.status === 'submitted' || repair.status === 'estimated')
  const canSelectEstimate =
    isCustomerOwner && (repair.status === 'submitted' || repair.status === 'estimated')

  return (
    <div className="space-y-6">
      {isVendor && myActiveEstimate?.status === 'pending' ? (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-h3 font-semibold text-foreground">
                Your pending estimate
              </h3>
              <p className="mt-1 text-ui text-muted-foreground">
                Edit itemized lines or withdraw if you no longer want to bid on this ticket.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to={`/dashboard/marketplace/${repair.id}/estimate`}
                className={buttonVariants({ variant: 'outline' })}
              >
                <Pencil className="mr-1.5 size-4" aria-hidden />
                Edit estimate
              </Link>
              <Button
                variant="outline"
                disabled={withdrawMutation.isPending}
                onClick={() => withdrawMutation.mutate(myActiveEstimate.id)}
                className="text-rose-600 hover:bg-rose-500/10"
              >
                Withdraw
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {canVendorSubmit ? (
        <div className="rounded-2xl border border-primary/30 bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-primary">
                <Store className="h-5 w-5" />
                <h3 className="font-display text-h3 font-semibold text-foreground">
                  Submit itemized estimate
                </h3>
              </div>
              <p className="mt-1 text-ui text-muted-foreground">
                Open the full dashboard form to add components, labour, and notes.
              </p>
            </div>
            <Link
              to={`/dashboard/marketplace/${repair.id}/estimate`}
              className={buttonVariants({ className: 'w-full sm:w-auto' })}
            >
              Open estimate form
            </Link>
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-h3 font-semibold text-foreground">
              Technician Estimates & Proposals ({estimates.length})
            </h2>
            <p className="mt-0.5 text-caption text-muted-foreground">
              Tap a proposal to open the full itemized report in your dashboard.
            </p>
          </div>
          {repair.assignedVendorName ? (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-caption font-semibold text-emerald-400">
              <UserCheck className="h-3.5 w-3.5" />
              <span>Assigned: {repair.assignedVendorName}</span>
            </div>
          ) : null}
        </div>

        {isLoading ? (
          <div className="flex h-36 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : estimates.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-border bg-secondary/20 p-8 text-center">
            <Store className="mx-auto h-8 w-8 text-muted-foreground" />
            <h3 className="mt-2 text-ui font-semibold text-foreground">
              No Estimates Received Yet
            </h3>
            <p className="mt-1 text-caption text-muted-foreground">
              {isVendor
                ? 'Be the first technician to submit an itemized estimate for this ticket.'
                : 'Technicians are reviewing your ticket. Itemized estimates will appear here.'}
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {estimates.map((est) => {
              const isAccepted = est.status === 'accepted'
              const statusLabel = estimateStatusLabel(est.status)
              const actionable = isEstimateActionable(est.status)
              const componentPreview =
                est.componentLines && est.componentLines.length > 0
                  ? est.componentLines
                      .slice(0, 2)
                      .map((line) => line.component)
                      .join(' · ')
                  : est.notes

              return (
                <div
                  key={est.id}
                  className={cn(
                    'relative overflow-hidden rounded-xl border transition-all',
                    isAccepted
                      ? 'border-emerald-500/60 bg-emerald-500/5 shadow-sm'
                      : actionable
                        ? 'border-border bg-secondary/30 hover:border-primary/40'
                        : 'border-border/70 bg-secondary/15 opacity-90',
                  )}
                >
                  <Link
                    to={`/dashboard/repairs/${repair.id}/estimates/${est.id}`}
                    className="group block p-5 pr-12 transition hover:bg-secondary/40"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-display text-base font-bold text-foreground">
                            {est.vendorName}
                          </span>
                          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                            Certified Technician
                          </span>
                          {isAccepted ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                              <CheckCircle className="h-3 w-3" />
                              Accepted Vendor
                            </span>
                          ) : null}
                          {statusLabel ? (
                            <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                              {statusLabel}
                            </span>
                          ) : null}
                        </div>

                        <p className="line-clamp-2 text-ui leading-relaxed text-foreground/90">
                          {componentPreview}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-caption text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            <span>
                              Turnaround:{' '}
                              <strong className="text-foreground">{est.turnaroundTime}</strong>
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                            <span>
                              Warranty:{' '}
                              <strong className="text-foreground">
                                {est.warrantyMonths} Months
                              </strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Estimated total
                        </p>
                        <p className="font-display text-h3 font-bold text-primary">
                          {estimateTotalLabel(est)}
                        </p>
                        <span className="mt-2 inline-flex items-center gap-1 text-caption font-semibold text-primary">
                          View full report
                          <ChevronRight className="size-4 transition group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </Link>

                  {canSelectEstimate && actionable ? (
                    <div className="space-y-3 border-t border-border/80 px-5 py-3">
                      {rejectingId === est.id ? (
                        <div className="space-y-2 rounded-lg border border-border bg-background p-3">
                          <label className="text-caption font-medium text-foreground">
                            Reason (optional)
                          </label>
                          <textarea
                            rows={2}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full rounded-md border border-border bg-background p-2 text-ui"
                            placeholder="e.g. Price too high, prefer another technician…"
                          />
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={rejectMutation.isPending}
                              onClick={() =>
                                rejectMutation.mutate({
                                  estimateId: est.id,
                                  reason: rejectReason.trim() || undefined,
                                })
                              }
                            >
                              Confirm reject
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setRejectingId(null)
                                setRejectReason('')
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : null}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          disabled={selectMutation.isPending}
                          onClick={() => selectMutation.mutate(est.id)}
                        >
                          {selectMutation.isPending ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <CheckCircle className="h-3.5 w-3.5" />
                          )}
                          <span className="ml-1.5">Accept & Assign</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={rejectMutation.isPending}
                          onClick={() => setRejectingId(est.id)}
                          className="text-rose-600 hover:bg-rose-500/10"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span className="ml-1.5">Reject</span>
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
