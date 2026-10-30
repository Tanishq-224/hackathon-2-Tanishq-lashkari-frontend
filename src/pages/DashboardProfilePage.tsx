import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { BadgeCheck, Loader2, Mail, Shield, Store, UserRound, Wrench } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateProfileRequest } from '@/features/auth/api/authApi'
import { ProfilePasswordResetSection } from '@/features/auth/components/ProfilePasswordResetSection'
import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from '@/features/auth/lib/auth-schemas'
import {
  customerRepairsQueryKey,
  fetchMyRepairRequests,
  vendorRepairsQueryKey,
} from '@/features/repairs/api/repairsApi'
import { authSessionQueryKey, getProfileInitials, useAuthSession } from '@/hooks/useAuthSession'
import { useAppToast } from '@/components/shared/AppToastProvider'
import { getApiErrorMessage } from '@/lib/api-client'
import { cn } from '@/lib/utils'

/**
 * @description Customer or vendor account profile inside the dashboard workspace.
 */
export function DashboardProfilePage() {
  const { user } = useAuthSession()
  const queryClient = useQueryClient()
  const isVendor = user?.role === 'vendor'
  const { pushError, pushSuccess } = useAppToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { fullName: user?.fullName ?? '' },
  })

  useEffect(() => {
    if (user?.fullName) {
      reset({ fullName: user.fullName })
    }
  }, [user?.fullName, reset])

  const { data: repairs = [], isLoading: repairsLoading } = useQuery({
    queryKey: isVendor ? vendorRepairsQueryKey : customerRepairsQueryKey,
    queryFn: fetchMyRepairRequests,
    enabled: Boolean(user),
  })

  const activeCount = repairs.filter(
    (r) => r.status !== 'completed' && r.status !== 'cancelled',
  ).length
  const completedCount = repairs.filter((r) => r.status === 'completed').length

  const updateMutation = useMutation({
    mutationFn: (values: UpdateProfileFormValues) =>
      updateProfileRequest({ fullName: values.fullName.trim() }),
    onSuccess: (updated) => {
      pushSuccess('Profile saved successfully.')
      reset({ fullName: updated.fullName })
      void queryClient.invalidateQueries({ queryKey: authSessionQueryKey })
    },
    onError: (err) => pushError(getApiErrorMessage(err)),
  })

  if (!user) {
    return null
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/15 via-card to-card p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/25">
            {getProfileInitials(user.fullName)}
          </div>
          <div className="flex-1">
            <p className="text-caption font-semibold uppercase tracking-wider text-primary">
              {isVendor ? 'Verified vendor profile' : 'Customer account'}
            </p>
            <h1 className="font-display text-h2 font-bold text-foreground">{user.fullName}</h1>
            <p className="mt-1 flex items-center gap-2 text-ui text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" />
              {user.email}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background/80 px-3 py-2 text-ui">
            {isVendor ? (
              <>
                <Store className="h-4 w-4 text-primary" />
                <span className="font-medium">Vendor Portal</span>
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 text-primary" />
                <span className="font-medium">Customer Workspace</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-caption font-medium uppercase text-muted-foreground">Total tickets</p>
          <p className="mt-2 font-display text-3xl font-bold text-foreground">
            {repairsLoading ? '—' : repairs.length}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-caption font-medium uppercase text-muted-foreground">Active</p>
          <p className="mt-2 font-display text-3xl font-bold text-primary">
            {repairsLoading ? '—' : activeCount}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-caption font-medium uppercase text-muted-foreground">Completed</p>
          <p className="mt-2 font-display text-3xl font-bold text-emerald-500">
            {repairsLoading ? '—' : completedCount}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 text-foreground">
          <UserRound className="h-5 w-5 text-primary" />
          <h2 className="font-display text-h3 font-semibold">Account information</h2>
        </div>
        <p className="mt-1 text-ui text-muted-foreground">
          Edit how your name appears on estimates, quotations, and repair updates. Email is tied to
          login and OTP verification.
        </p>

        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            void handleSubmit((values) => {
              updateMutation.mutate(values)
            })(e)
          }}
        >
          <label className="block text-ui font-medium text-foreground">
            Display name
            <Input
              className={cn('mt-1.5', errors.fullName && 'border-destructive')}
              autoComplete="name"
              maxLength={80}
              {...register('fullName')}
            />
            {errors.fullName ? (
              <p className="mt-1 text-caption text-destructive">{errors.fullName.message}</p>
            ) : null}
          </label>

          <label className="block text-ui font-medium text-foreground">
            Email address
            <Input
              value={user.email}
              readOnly
              disabled
              className="mt-1.5 bg-muted/50 text-muted-foreground"
              autoComplete="email"
            />
            <p className="mt-1 text-caption text-muted-foreground">
              Contact support to change your sign-in email.
            </p>
          </label>

          <label className="block text-ui font-medium text-foreground">
            Account type
            <Input
              value={isVendor ? 'Vendor' : 'Customer'}
              readOnly
              disabled
              className="mt-1.5 w-full max-w-xs bg-muted/50 capitalize text-muted-foreground"
            />
          </label>

          <Button
            type="submit"
            disabled={updateMutation.isPending || !isDirty}
            className="gap-2"
          >
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <BadgeCheck className="h-4 w-4" />
            )}
            Save changes
          </Button>
        </form>
      </div>

      <ProfilePasswordResetSection email={user.email} />

      <div className="rounded-xl border border-dashed border-border bg-card/50 p-5 text-ui text-muted-foreground">
        <div className="flex items-start gap-3">
          <Wrench className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>
            {isVendor
              ? 'Your marketplace reputation is tied to timely estimates, clear quotations, and completion proof photos.'
              : 'Keep notification emails enabled in your inbox so you never miss estimates, quotes, or pickup alerts.'}
          </p>
        </div>
      </div>
    </div>
  )
}
