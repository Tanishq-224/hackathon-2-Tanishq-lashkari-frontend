import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, CheckCheck, Loader2 } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  fetchNotifications,
  markAllNotificationsReadRequest,
  markNotificationReadRequest,
  notificationsQueryKey,
  type AppNotification,
} from '@/features/notifications/api/notificationsApi'

/**
 * @description Header bell dropdown for lifecycle in-app notifications.
 */
export function DashboardNotificationsBell() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: notificationsQueryKey,
    queryFn: fetchNotifications,
    refetchInterval: 45_000,
  })

  const unreadCount = data?.unreadCount ?? 0
  const notifications = data?.notifications ?? []

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const readOneMutation = useMutation({
    mutationFn: markNotificationReadRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationsQueryKey })
    },
  })

  const readAllMutation = useMutation({
    mutationFn: markAllNotificationsReadRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationsQueryKey })
    },
  })

  function handleOpenNotification(notification: AppNotification) {
    if (!notification.read) {
      readOneMutation.mutate(notification.id)
    }
    setOpen(false)
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/50 text-foreground transition hover:bg-secondary"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-ui font-semibold text-foreground">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => readAllMutation.mutate()}
                className="flex items-center gap-1 text-caption font-medium text-primary hover:underline"
              >
                {readAllMutation.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <CheckCheck className="h-3 w-3" />
                )}
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <p className="px-4 py-6 text-center text-ui text-muted-foreground">Loading…</p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-ui text-muted-foreground">
                No updates yet — repair milestones will appear here.
              </p>
            ) : (
              notifications.map((n) => {
                const content = (
                  <>
                    <p
                      className={`text-ui font-medium ${n.read ? 'text-muted-foreground' : 'text-foreground'}`}
                    >
                      {n.title}
                    </p>
                    <p className="mt-0.5 text-caption text-muted-foreground line-clamp-2">
                      {n.message}
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground/80">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </>
                )

                const className = `block w-full border-b border-border px-4 py-3 text-left transition hover:bg-secondary/60 ${
                  n.read ? 'opacity-80' : 'bg-primary/5'
                }`

                return n.repairRequestId ? (
                  <Link
                    key={n.id}
                    to={`/dashboard/repairs/${n.repairRequestId}`}
                    className={className}
                    onClick={() => handleOpenNotification(n)}
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    key={n.id}
                    type="button"
                    className={className}
                    onClick={() => handleOpenNotification(n)}
                  >
                    {content}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
