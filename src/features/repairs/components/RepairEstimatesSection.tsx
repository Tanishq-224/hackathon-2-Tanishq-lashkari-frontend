import { useState } from 'react'
import {
  CheckCircle,
  Clock,
  Loader2,
  Send,
  ShieldCheck,
  Store,
  UserCheck,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  fetchRepairEstimates,
  repairDetailQueryKey,
  repairEstimatesQueryKey,
  selectEstimateRequest,
  submitEstimateRequest,
  type EstimateItem,
  type RepairItem,
} from '@/features/repairs/api/repairsApi'
import { getApiErrorMessage } from '@/lib/api-client'
import { cn } from '@/lib/utils'

type RepairEstimatesSectionProps = {
  repair: RepairItem
  userRole?: 'customer' | 'vendor' | 'admin'
  userId?: string
}

export function RepairEstimatesSection({
  repair,
  userRole,
  userId,
}: RepairEstimatesSectionProps) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Vendor Submit Estimate form states
  const [minCost, setMinCost] = useState('')
  const [maxCost, setMaxCost] = useState('')
  const [turnaroundTime, setTurnaroundTime] = useState('24 Hours')
  const [warrantyMonths, setWarrantyMonths] = useState('6')
  const [notes, setNotes] = useState('')
  const [isSubmittingEstimate, setIsSubmittingEstimate] = useState(false)

  const { data: estimates = [], isLoading } = useQuery({
    queryKey: repairEstimatesQueryKey(repair.id),
    queryFn: () => fetchRepairEstimates(repair.id),
  })

  const selectMutation = useMutation({
    mutationFn: (estimateId: string) => selectEstimateRequest(repair.id, estimateId),
    onSuccess: () => {
      setSuccessMessage('Estimate accepted! The technician has been assigned to your repair.')
      void queryClient.invalidateQueries({ queryKey: repairDetailQueryKey(repair.id) })
      void queryClient.invalidateQueries({ queryKey: repairEstimatesQueryKey(repair.id) })
    },
    onError: (err) => {
      setErrorMessage(getApiErrorMessage(err))
    },
  })

  async function handleVendorSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const min = parseFloat(minCost)
    const max = parseFloat(maxCost)
    const warranty = parseInt(warrantyMonths, 10)

    if (isNaN(min) || min <= 0) {
      setErrorMessage('Please enter a valid minimum estimated price.')
      return
    }
    if (isNaN(max) || max < min) {
      setErrorMessage('Maximum estimated price must be greater than or equal to minimum price.')
      return
    }
    if (!turnaroundTime.trim()) {
      setErrorMessage('Please specify an estimated turnaround time (e.g. 24 Hours).')
      return
    }
    if (notes.trim().length < 5) {
      setErrorMessage('Please provide a brief repair plan note (at least 5 characters).')
      return
    }

    setIsSubmittingEstimate(true)
    try {
      await submitEstimateRequest(repair.id, {
        minCost: min,
        maxCost: max,
        turnaroundTime: turnaroundTime.trim(),
        warrantyMonths: isNaN(warranty) ? 3 : warranty,
        notes: notes.trim(),
      })
      setSuccessMessage('Your estimate has been submitted to the customer!')
      setMinCost('')
      setMaxCost('')
      setNotes('')
      void queryClient.invalidateQueries({ queryKey: repairDetailQueryKey(repair.id) })
      void queryClient.invalidateQueries({ queryKey: repairEstimatesQueryKey(repair.id) })
    } catch (err) {
      setErrorMessage(getApiErrorMessage(err))
    } finally {
      setIsSubmittingEstimate(false)
    }
  }

  const isCustomerOwner = userRole === 'customer'
  const isVendor = userRole === 'vendor'
  const canSelectEstimate =
    isCustomerOwner && (repair.status === 'submitted' || repair.status === 'estimated')
  const alreadySubmittedByMe =
    isVendor && estimates.some((e) => e.vendorId === userId)
  const canVendorSubmit =
    isVendor &&
    !alreadySubmittedByMe &&
    (repair.status === 'submitted' || repair.status === 'estimated')

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-ui text-destructive">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-ui text-emerald-400">
          {successMessage}
        </div>
      )}

      {/* Vendor: Submit Estimate Card */}
      {canVendorSubmit && (
        <div className="rounded-2xl border border-primary/30 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2.5 text-primary">
            <Store className="h-5 w-5" />
            <h3 className="font-display text-h3 font-semibold text-foreground">
              Submit Repair Estimate
            </h3>
          </div>
          <p className="mt-1 text-ui text-muted-foreground">
            Provide a price range, turnaround speed, and repair breakdown for this ticket.
          </p>

          <form onSubmit={handleVendorSubmit} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-caption font-medium text-foreground">
                  Min Estimated Price ($) *
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
                    placeholder="80"
                    className="pl-7"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-caption font-medium text-foreground">
                  Max Estimated Price ($) *
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
                    placeholder="120"
                    className="pl-7"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-caption font-medium text-foreground">
                  Estimated Turnaround *
                </label>
                <Input
                  type="text"
                  value={turnaroundTime}
                  onChange={(e) => setTurnaroundTime(e.target.value)}
                  placeholder="e.g. 24 Hours, Same-Day, 2 Days"
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
                Repair Plan & Parts Notes *
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g. OEM display replacement, adhesive reseal, touchscreen calibration included."
                className="mt-1 w-full rounded-xl border border-input bg-background p-3 text-ui text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmittingEstimate}
              className="flex items-center gap-2"
            >
              {isSubmittingEstimate ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Estimate to Customer</span>
                </>
              )}
            </Button>
          </form>
        </div>
      )}

      {/* Estimates List Section */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-h3 font-semibold text-foreground">
              Technician Estimates & Proposals ({estimates.length})
            </h2>
            <p className="mt-0.5 text-caption text-muted-foreground">
              Review quotes submitted by certified repair shops.
            </p>
          </div>
          {repair.assignedVendorName && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-caption font-semibold text-emerald-400">
              <UserCheck className="h-3.5 w-3.5" />
              <span>Assigned: {repair.assignedVendorName}</span>
            </div>
          )}
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
                ? 'Be the first technician to submit an estimate for this customer request!'
                : 'Technicians in the marketplace are reviewing your ticket details. Estimates usually appear within a few hours.'}
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {estimates.map((est: EstimateItem) => {
              const isAccepted = est.status === 'accepted'
              return (
                <div
                  key={est.id}
                  className={cn(
                    'relative rounded-xl border p-5 transition-all',
                    isAccepted
                      ? 'border-emerald-500/60 bg-emerald-500/5 shadow-sm'
                      : 'border-border bg-secondary/30 hover:border-border/80',
                  )}
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-display text-base font-bold text-foreground">
                          {est.vendorName}
                        </span>
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                          Certified Technician
                        </span>
                        {isAccepted && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                            <CheckCircle className="h-3 w-3" />
                            Accepted Vendor
                          </span>
                        )}
                      </div>

                      <p className="text-ui leading-relaxed text-foreground/90">
                        {est.notes}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-caption text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          <span>Turnaround: <strong className="text-foreground">{est.turnaroundTime}</strong></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                          <span>Warranty: <strong className="text-foreground">{est.warrantyMonths} Months</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-3 sm:items-end sm:shrink-0">
                      <div className="text-left sm:text-right">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Estimated Cost
                        </p>
                        <p className="font-display text-h3 font-bold text-primary">
                          ${est.minCost} - ${est.maxCost}
                        </p>
                      </div>

                      {canSelectEstimate && (
                        <Button
                          size="sm"
                          disabled={selectMutation.isPending}
                          onClick={() => selectMutation.mutate(est.id)}
                          className="flex items-center gap-1.5"
                        >
                          {selectMutation.isPending ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <CheckCircle className="h-3.5 w-3.5" />
                          )}
                          <span>Accept & Assign</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
