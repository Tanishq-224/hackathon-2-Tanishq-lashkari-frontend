import { apiClient } from '@/lib/api-client'

export type ContactMessageStatus = 'new' | 'in_progress' | 'resolved'
export type ContactTopic = 'platform' | 'vendor' | 'other'

export type AdminContactMessage = {
  id: string
  fullName: string
  email: string
  phone?: string
  topic: ContactTopic
  message: string
  status: ContactMessageStatus
  internalNote?: string
  createdAt: string
  updatedAt: string
}

export type AdminContactListResponse = {
  success: boolean
  data: {
    items: AdminContactMessage[]
    total: number
    page: number
    limit: number
  }
}

export const adminContactMessagesQueryKey = ['admin', 'contact-messages'] as const

export function adminContactMessagesQueryKeyWithFilters(filters: {
  status?: ContactMessageStatus | 'all'
  topic?: ContactTopic | 'all'
  page?: number
}) {
  return [...adminContactMessagesQueryKey, filters] as const
}

/**
 * @description Fetches paginated contact inbox for platform admins.
 */
export async function fetchAdminContactMessages(params?: {
  status?: ContactMessageStatus
  topic?: ContactTopic
  page?: number
  limit?: number
}): Promise<AdminContactListResponse['data']> {
  const { data } = await apiClient.get<AdminContactListResponse>('/api/admin/contact-messages', {
    params,
  })
  return data.data
}

/**
 * @description Updates workflow status or internal note on a contact message.
 */
export async function updateAdminContactMessage(
  id: string,
  patch: { status?: ContactMessageStatus; internalNote?: string },
): Promise<AdminContactMessage> {
  const { data } = await apiClient.patch<{
    success: boolean
    data: { message: AdminContactMessage }
  }>(`/api/admin/contact-messages/${id}`, patch)
  return data.data.message
}
