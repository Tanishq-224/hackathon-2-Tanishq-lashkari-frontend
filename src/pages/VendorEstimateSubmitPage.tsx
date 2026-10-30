import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { buttonVariants } from '@/components/ui/button'
import { DynamicEstimateForm } from '@/features/repairs/components/DynamicEstimateForm'
import {
  fetchRepairDetails,
  fetchRepairEstimates,
  repairDetailQueryKey,
  repairEstimatesQueryKey,
  submitEstimateRequest,
  updateEstimateRequest,
  type DynamicSubmitEstimatePayload,
} from '@/features/repairs/api/repairsApi'
import { useAppToast } from '@/components/shared/AppToastProvider'
import { useAuthSession } from '@/hooks/useAuthSession'
import { useRepairRealtimeSubscription } from '@/hooks/useRepairRealtimeSubscription'
import { getApiErrorMessage } from '@/lib/api-client'
import { cn } from '@/lib/utils'

/**
 * @description Full dashboard outlet page for vendors to submit itemized preliminary estimates.
 * @returns {JSX.Element}
 */
export function VendorEstimateSubmitPage() {
  const { repairId = '' } = useParams<{ repairId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { pushError } = useAppToast()
  const { user } = useAuthSession()
  useRepairRealtimeSubscription(repairId)

  const { data: repair, isLoading, error } = useQuery({
    queryKey: repairDetailQueryKey(repairId),
    queryFn: () => fetchRepairDetails(repairId),
    enabled: Boolean(repairId),
  })

  const { data: myEstimates = [] } = useQuery({
    queryKey: repairEstimatesQueryKey(repairId),
    queryFn: () => fetchRepairEstimates(repairId),
    enabled: Boolean(repairId) && user?.role === 'vendor',
  })

  const pendingEstimate = myEstimates.find(
    (item) => item.vendorId === user?.id && item.status === 'pending',
  )
  const editMode = Boolean(pendingEstimate)

  const submitMutation = useMutation({
    mutationFn: (payload: DynamicSubmitEstimatePayload) =>
      editMode && pendingEstimate
        ? updateEstimateRequest(repairId, pendingEstimate.id, payload)
        : submitEstimateRequest(repairId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['marketplace'] })
      void queryClient.invalidateQueries({ queryKey: repairDetailQueryKey(repairId) })
      void queryClient.invalidateQueries({ queryKey: repairEstimatesQueryKey(repairId) })
      navigate(`/dashboard/repairs/${repairId}`, { replace: true })
    },
    onError: (err) => {
      pushError(getApiErrorMessage(err))
    },
  })

  if (user?.role !== 'vendor') {
    return <Navigate to="/dashboard" replace />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
      </div>
    )
  }

  if (error || !repair) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center">
        <p className="text-ui text-destructive">Repair ticket not found.</p>
        <Link to="/dashboard/marketplace" className={buttonVariants({ className: 'mt-4' })}>
          Back to marketplace
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pb-10">
      <Link
        to="/dashboard/marketplace"
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'inline-flex items-center gap-1.5 px-0 text-muted-foreground hover:text-foreground',
        )}
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to marketplace
      </Link>

      <DynamicEstimateForm
        deviceLabel={`${repair.brand} ${repair.modelName}`}
        issueLabel={repair.issueCategory.replace(/_/g, ' ')}
        mode={editMode ? 'edit' : 'create'}
        initialValues={
          pendingEstimate?.componentLines?.length
            ? {
                componentLines: pendingEstimate.componentLines,
                labourCost: pendingEstimate.labourCost ?? 0,
                turnaroundTime: pendingEstimate.turnaroundTime,
                notes: pendingEstimate.notes,
              }
            : pendingEstimate
              ? {
                  componentLines: [
                    {
                      component: 'Repair scope',
                      price: pendingEstimate.minCost,
                      warrantyMonths: pendingEstimate.warrantyMonths,
                    },
                  ],
                  labourCost: 0,
                  turnaroundTime: pendingEstimate.turnaroundTime,
                  notes: pendingEstimate.notes,
                }
              : undefined
        }
        isSubmitting={submitMutation.isPending}
        onSubmit={async (payload) => {
          await submitMutation.mutateAsync(payload)
        }}
        onCancel={() => navigate('/dashboard/marketplace')}
      />
    </div>
  )
}
