import { useEffect, useState } from 'react'
import { BadgeCheck, Mail, Shield, Store, UserRound, Wrench } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateProfileRequest } from '@/features/auth/api/authApi'
import {
  customerRepairsQueryKey,
  fetchMyRepairRequests,
  vendorRepairsQueryKey,
} from '@/features/repairs/api/repairsApi'
import { authSessionQueryKey, getProfileInitials, useAuthSession } from '@/hooks/useAuthSession'
import { getApiErrorMessage } from '@/lib/api-client'

/**
 * @description Customer or vendor account profile inside the dashboard workspace.
 */
export function DashboardProfilePage() {
  const { user } = useAuthSession()
  const queryClient = useQueryClient()
  const isVendor = user?.role === 'vendor'

  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.fullName) {
      setFullName(user.fullName)
    }
  }, [user?.fullName])

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
    mutationFn: () => updateProfileRequest({ fullName: fullName.trim() }),
    onSuccess: () => {
      setMessage('Profile saved successfully.')
      setError(null)
      void queryClient.invalidateQueries({ queryKey: authSessionQueryKey })
    },
    onError: (err) => {
      setError(getApiErrorMessage(err))
      setMessage(null)
    },
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
          <h2 className="font-display text-h3 font-semibold">Edit profile</h2>
        </div>
        <p className="mt-1 text-ui text-muted-foreground">
          Update how your name appears on estimates, quotations, and repair updates.
        </p>

        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            updateMutation.mutate()
          }}
        >
          <label className="block text-ui font-medium text-foreground">
            Display name
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1.5"
              minLength={2}
              maxLength={80}
              required
            />
          </label>

          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-ui text-destructive">
              {error}
            </p>
          )}
          {message && (
            <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-ui text-emerald-600 dark:text-emerald-400">
              {message}
            </p>
          )}

          <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
            <BadgeCheck className="h-4 w-4" />
            Save profile
          </Button>
        </form>
      </div>

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
