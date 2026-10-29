import { apiClient } from '@/lib/api-client'

export type NotificationType =
  | 'estimate_received'
  | 'vendor_assigned'
  | 'quotation_ready'
  | 'quote_approved'
  | 'quote_declined'
  | 'repair_ready_pickup'

export type AppNotification = {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  repairRequestId?: string
  read: boolean
  createdAt: string
  updatedAt: string
}

export const notificationsQueryKey = ['notifications', 'inbox'] as const

/**
 * @description Fetches in-app notifications and unread badge count.
 * @async
 */
export async function fetchNotifications(): Promise<{
  notifications: AppNotification[]
  unreadCount: number
}> {
  const { data } = await apiClient.get<{
    success: boolean
    data: { notifications: AppNotification[]; unreadCount: number }
  }>('/api/notifications')
  return data.data
}

/**
 * @description Marks a single notification as read.
 * @async
 */
export async function markNotificationReadRequest(
  notificationId: string,
): Promise<AppNotification> {
  const { data } = await apiClient.patch<{
    success: boolean
    data: { notification: AppNotification }
  }>(`/api/notifications/${notificationId}/read`)
  return data.data.notification
}

/**
 * @description Marks all notifications as read.
 * @async
 */
export async function markAllNotificationsReadRequest(): Promise<number> {
  const { data } = await apiClient.post<{
    success: boolean
    data: { updated: number }
  }>('/api/notifications/read-all')
  return data.data.updated
}
