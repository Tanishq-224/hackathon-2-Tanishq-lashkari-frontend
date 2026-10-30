import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Loader2, Pencil, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Button, buttonVariants } from '@/components/ui/button'
import { EstimateReportView } from '@/features/repairs/components/EstimateReportView'
import {
  fetchRepairDetails,
  fetchRepairEstimates,
  rejectEstimateRequest,
  repairDetailQueryKey,
  repairEstimatesQueryKey,
  selectEstimateRequest,
  withdrawEstimateRequest,
} from '@/features/repairs/api/repairsApi'
import { isEstimateActionable } from '@/features/repairs/lib/estimate-status'
import { useAppToast } from '@/components/shared/AppToastProvider'
import { useAuthSession } from '@/hooks/useAuthSession'
import { useRepairRealtimeSubscription } from '@/hooks/useRepairRealtimeSubscription'
import { getApiErrorMessage } from '@/lib/api-client'
import { cn } from '@/lib/utils'

/**
 * @description Dashboard outlet view for a single estimate report (customer/vendor read-only).
 * @returns {JSX.Element}
 */
export function EstimateDetailPage() {
  const { id: repairId = '', estimateId = '' } = useParams<{
    id: string
    estimateId: string
  }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { pushError, pushSuccess } = useAppToast()
  const { user } = useAuthSession()
  useRepairRealtimeSubscription(repairId)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)

  const repairQuery = useQuery({
    queryKey: repairDetailQueryKey(repairId),
    queryFn: () => fetchRepairDetails(repairId),
    enabled: Boolean(repairId),
  })

  const estimatesQuery = useQuery({
    queryKey: repairEstimatesQueryKey(repairId),
    queryFn: () => fetchRepairEstimates(repairId),
    enabled: Boolean(repairId),
  })

  const estimate = estimatesQuery.data?.find((item) => item.id === estimateId)

  const repair = repairQuery.data
  const isOwner = Boolean(user?.id && repair?.customerId === user.id)
  const canAccept =
    user?.role === 'customer' &&
    isOwner &&
    repair &&
    isEstimateActionable(estimate?.status ?? 'declined') &&
    (repair.status === 'submitted' || repair.status === 'estimated')

  const isVendorOwner =
    user?.role === 'vendor' &&
    estimate &&
    estimate.vendorId === user.id &&
    isEstimateActionable(estimate.status)

  const selectMutation = useMutation({
    mutationFn: () => selectEstimateRequest(repairId, estimateId),
    onSuccess: () => {
      pushSuccess('Technician assigned successfully.')
      void queryClient.invalidateQueries({ queryKey: repairDetailQueryKey(repairId) })
      void queryClient.invalidateQueries({ queryKey: repairEstimatesQueryKey(repairId) })
    },
    onError: (err) => pushError(getApiErrorMessage(err)),
  })

  const rejectMutation = useMutation({
    mutationFn: () => rejectEstimateRequest(repairId, estimateId, rejectReason.trim() || undefined),
    onSuccess: () => {
      pushSuccess('Estimate rejected.')
      void queryClient.invalidateQueries({ queryKey: repairEstimatesQueryKey(repairId) })
      navigate(`/dashboard/repairs/${repairId}`)
    },
    onError: (err) => pushError(getApiErrorMessage(err)),
  })

  const withdrawMutation = useMutation({
    mutationFn: () => withdrawEstimateRequest(repairId, estimateId),
    onSuccess: () => {
      pushSuccess('Estimate withdrawn.')
      void queryClient.invalidateQueries({ queryKey: repairEstimatesQueryKey(repairId) })
      navigate('/dashboard/marketplace')
    },
    onError: (err) => pushError(getApiErrorMessage(err)),
  })

  if (repairQuery.isLoading || estimatesQuery.isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
      </div>
    )
  }

  if (!repairQuery.data || !estimate) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center">
        <p className="text-ui text-destructive">Estimate report not found.</p>
        <Link
          to={`/dashboard/repairs/${repairId}`}
          className={buttonVariants({ className: 'mt-4' })}
        >
          Back to repair
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 pb-10">
      <Link
        to={`/dashboard/repairs/${repair!.id}`}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'inline-flex items-center gap-1.5 px-0 text-muted-foreground hover:text-foreground',
        )}
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to {repair.brand} {repair.modelName}
      </Link>

      <EstimateReportView estimate={estimate} />

      {canAccept ? (
        <div className="space-y-4 border-t border-border pt-4">
          {showRejectForm ? (
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <label className="text-ui font-medium text-foreground">
                Reason for rejecting (optional)
              </label>
              <textarea
                rows={2}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full rounded-md border border-border bg-background p-2.5 text-ui"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="destructive"
                  disabled={rejectMutation.isPending}
                  onClick={() => rejectMutation.mutate()}
                >
                  Confirm reject
                </Button>
                <Button variant="ghost" onClick={() => setShowRejectForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : null}
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              variant="outline"
              disabled={selectMutation.isPending}
              onClick={() => setShowRejectForm(true)}
              className="text-rose-600 hover:bg-rose-500/10"
            >
              <XCircle className="mr-2 size-4" aria-hidden />
              Reject estimate
            </Button>
            <Button
              disabled={selectMutation.isPending}
              onClick={() => selectMutation.mutate()}
              className="min-w-[12rem]"
            >
              {selectMutation.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
              ) : (
                <CheckCircle className="mr-2 size-4" aria-hidden />
              )}
              Accept & assign
            </Button>
          </div>
        </div>
      ) : null}

      {isVendorOwner && repair ? (
        <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/marketplace/${repair.id}/estimate`)}
          >
            <Pencil className="mr-2 size-4" aria-hidden />
            Edit estimate
          </Button>
          <Button
            variant="outline"
            disabled={withdrawMutation.isPending}
            onClick={() => withdrawMutation.mutate()}
            className="text-rose-600 hover:bg-rose-500/10"
          >
            Withdraw estimate
          </Button>
        </div>
      ) : null}
    </div>
  )
}
