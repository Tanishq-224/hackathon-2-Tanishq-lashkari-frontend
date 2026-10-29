import { useState } from 'react'
import {
  Camera,
  CheckCircle2,
  Loader2,
  PackageCheck,
  Sparkles,
  Wrench,
} from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import {
  confirmRepairPickupRequest,
  repairDetailQueryKey,
  startRepairWorkRequest,
  submitRepairCompletionRequest,
  uploadRepairImage,
  type ImageAttachment,
  type RepairItem,
} from '@/features/repairs/api/repairsApi'
import { getApiErrorMessage } from '@/lib/api-client'
import { cn } from '@/lib/utils'

type RepairCompletionSectionProps = {
  repair: RepairItem
  userRole?: 'customer' | 'vendor' | 'admin'
  userId?: string
}

/**
 * @description Phase 6 repair execution UI — vendor bench actions and customer before/after proof.
 */
export function RepairCompletionSection({
  repair,
  userRole,
  userId,
}: RepairCompletionSectionProps) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [benchNotes, setBenchNotes] = useState(repair.repairBenchNotes ?? '')
  const [resolutionSummary, setResolutionSummary] = useState(repair.resolutionSummary ?? '')
  const [afterImages, setAfterImages] = useState<ImageAttachment[]>(
    repair.afterRepairImages ?? [],
  )
  const [isUploading, setIsUploading] = useState(false)

  const isAssignedVendor =
    (userRole === 'vendor' && repair.assignedVendorId === userId) || userRole === 'admin'
  const isCustomer = userRole === 'customer' || userRole === 'admin'

  const showSection = [
    'quote_approved',
    'in_repair',
    'ready_for_pickup',
    'completed',
  ].includes(repair.status)

  if (!showSection) {
    return null
  }

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: repairDetailQueryKey(repair.id) })
  }

  const startMutation = useMutation({
    mutationFn: () =>
      startRepairWorkRequest(repair.id, {
        repairBenchNotes: benchNotes.trim() || undefined,
      }),
    onSuccess: (data) => {
      setSuccessMessage(data.message)
      setErrorMessage(null)
      invalidate()
    },
    onError: (err) => setErrorMessage(getApiErrorMessage(err)),
  })

  const completionMutation = useMutation({
    mutationFn: () =>
      submitRepairCompletionRequest(repair.id, {
        afterRepairImages: afterImages,
        resolutionSummary: resolutionSummary.trim(),
      }),
    onSuccess: (data) => {
      setSuccessMessage(data.message)
      setErrorMessage(null)
      invalidate()
    },
    onError: (err) => setErrorMessage(getApiErrorMessage(err)),
  })

  const pickupMutation = useMutation({
    mutationFn: () => confirmRepairPickupRequest(repair.id),
    onSuccess: (data) => {
      setSuccessMessage(data.message)
      setErrorMessage(null)
      invalidate()
    },
    onError: (err) => setErrorMessage(getApiErrorMessage(err)),
  })

  async function handleAfterPhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return
    if (afterImages.length + files.length > 5) {
      setErrorMessage('You can upload up to 5 after-repair photos.')
      return
    }

    setIsUploading(true)
    setErrorMessage(null)
    try {
      for (const file of Array.from(files)) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
        const uploaded = await uploadRepairImage(base64)
        setAfterImages((prev) => [...prev, uploaded])
      }
    } catch {
      setErrorMessage('Failed to upload proof photo. Please try again.')
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  const beforeImages = repair.images
  const afterProof = repair.afterRepairImages ?? afterImages
  const showComparison =
    (repair.status === 'ready_for_pickup' || repair.status === 'completed') &&
    beforeImages.length > 0 &&
    afterProof.length > 0

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2.5 text-primary">
        <Wrench className="h-5 w-5" />
        <h2 className="font-display text-h3 font-semibold text-foreground">
          Repair Execution & Completion
        </h2>
      </div>

      {errorMessage && (
        <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-ui text-destructive">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-ui text-emerald-600 dark:text-emerald-400">
          {successMessage}
        </p>
      )}

      {isAssignedVendor && repair.status === 'quote_approved' && (
        <div className="mt-5 space-y-4">
          <p className="text-ui text-muted-foreground">
            Customer authorized the final quote. Log bench notes and start physical repair work.
          </p>
          <label className="block text-ui font-medium text-foreground">
            Bench notes (optional)
            <textarea
              value={benchNotes}
              onChange={(e) => setBenchNotes(e.target.value)}
              rows={3}
              placeholder="Parts pulled, ESD setup, expected bench timeline…"
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-ui text-foreground"
            />
          </label>
          <Button
            type="button"
            onClick={() => startMutation.mutate()}
            disabled={startMutation.isPending}
            className="gap-2"
          >
            {startMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Start Repair Work
          </Button>
        </div>
      )}

      {isAssignedVendor && repair.status === 'in_repair' && (
        <div className="mt-5 space-y-4">
          {repair.repairBenchNotes && (
            <p className="rounded-lg bg-secondary/60 px-3 py-2 text-ui text-muted-foreground">
              <span className="font-medium text-foreground">Bench log: </span>
              {repair.repairBenchNotes}
            </p>
          )}
          <label className="block text-ui font-medium text-foreground">
            Resolution summary
            <textarea
              value={resolutionSummary}
              onChange={(e) => setResolutionSummary(e.target.value)}
              rows={4}
              placeholder="Describe tests run, parts replaced, and customer-facing outcome…"
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-ui text-foreground"
            />
          </label>

          <div>
            <p className="text-ui font-medium text-foreground">After-repair proof photos</p>
            <p className="text-caption text-muted-foreground">
              Device powered on, issue fixed — up to 5 photos.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {afterImages.map((img, i) => (
                <img
                  key={img.publicId ?? i}
                  src={img.url}
                  alt={`After repair ${i + 1}`}
                  className="h-20 w-28 rounded-lg border border-border object-cover"
                />
              ))}
              <label
                className={cn(
                  'flex h-20 w-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/40 text-caption text-muted-foreground transition hover:border-primary/50',
                  isUploading && 'pointer-events-none opacity-60',
                )}
              >
                <Camera className="mb-1 h-5 w-5" />
                {isUploading ? 'Uploading…' : 'Add photo'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  multiple
                  onChange={(e) => void handleAfterPhotoUpload(e)}
                />
              </label>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => completionMutation.mutate()}
            disabled={completionMutation.isPending || afterImages.length === 0}
            className="gap-2"
          >
            {completionMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PackageCheck className="h-4 w-4" />
            )}
            Submit Completion & Mark Ready for Pickup
          </Button>
        </div>
      )}

      {(repair.status === 'ready_for_pickup' || repair.status === 'completed') && (
        <div className="mt-5 space-y-5">
          {repair.resolutionSummary && (
            <div className="rounded-lg border border-border bg-secondary/30 p-4">
              <p className="text-ui font-semibold text-foreground">Technician resolution</p>
              <p className="mt-2 whitespace-pre-wrap text-ui text-muted-foreground">
                {repair.resolutionSummary}
              </p>
            </div>
          )}

          {typeof repair.finalApprovedAmount === 'number' && (
            <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
              <span className="text-ui font-medium text-foreground">Authorized repair total</span>
              <span className="font-display text-xl font-bold text-emerald-600 dark:text-emerald-400">
                ${repair.finalApprovedAmount.toFixed(2)}
              </span>
            </div>
          )}

          {showComparison && (
            <div>
              <p className="mb-3 text-ui font-semibold text-foreground">Before vs after</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-caption font-medium uppercase tracking-wide text-muted-foreground">
                    Before (customer report)
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {beforeImages.slice(0, 4).map((img, i) => (
                      <img
                        key={`before-${i}`}
                        src={img.url}
                        alt={`Before ${i + 1}`}
                        className="aspect-video rounded-lg border border-border object-cover"
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-caption font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                    After (bench proof)
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {afterProof.slice(0, 4).map((img, i) => (
                      <img
                        key={`after-${i}`}
                        src={img.url}
                        alt={`After ${i + 1}`}
                        className="aspect-video rounded-lg border border-emerald-500/30 object-cover"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isCustomer && repair.status === 'ready_for_pickup' && (
            <Button
              type="button"
              variant="default"
              className="gap-2 bg-emerald-600 hover:bg-emerald-600/90"
              onClick={() => pickupMutation.mutate()}
              disabled={pickupMutation.isPending}
            >
              {pickupMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Confirm Pickup & Close Ticket
            </Button>
          )}

          {repair.status === 'completed' && (
            <p className="flex items-center gap-2 text-ui font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
              Repair completed — thank you for using Repairex.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
