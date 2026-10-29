import { apiClient } from '@/lib/api-client'

export type DeviceType =
  | 'phone'
  | 'laptop'
  | 'tablet'
  | 'audio'
  | 'smartwatch'
  | 'other'

export type IssueCategory =
  | 'screen'
  | 'battery'
  | 'charging'
  | 'water_damage'
  | 'audio'
  | 'software'
  | 'camera'
  | 'hardware'
  | 'other'

export type Urgency = 'low' | 'medium' | 'high' | 'immediate'

export type RepairStatus =
  | 'submitted'
  | 'estimated'
  | 'vendor_selected'
  | 'diagnosed'
  | 'quote_approved'
  | 'in_repair'
  | 'ready_for_pickup'
  | 'completed'
  | 'cancelled'

export type ImageAttachment = {
  url: string
  publicId?: string
}

export type RepairItem = {
  id: string
  customerId: string
  deviceType: DeviceType
  brand: string
  modelName: string
  issueCategory: IssueCategory
  description: string
  images: ImageAttachment[]
  urgency: Urgency
  status: RepairStatus
  estimatedBudgetMin?: number
  estimatedBudgetMax?: number
  createdAt: string
  updatedAt: string
}

export type CreateRepairPayload = {
  deviceType: DeviceType
  brand: string
  modelName: string
  issueCategory: IssueCategory
  description: string
  images?: ImageAttachment[]
  urgency?: Urgency
  estimatedBudgetMin?: number
  estimatedBudgetMax?: number
}

export const customerRepairsQueryKey = ['repairs', 'customer'] as const
export const repairDetailQueryKey = (id: string) => ['repairs', 'detail', id] as const

/**
 * @description Fetches all repair requests created by the current logged-in customer.
 * @async
 * @returns {Promise<RepairItem[]>}
 */
export async function fetchCustomerRepairs(): Promise<RepairItem[]> {
  const { data } = await apiClient.get<{
    success: boolean
    data: { repairs: RepairItem[] }
  }>('/api/repairs')
  return data.data.repairs
}

/**
 * @description Fetches a single repair request by ID.
 * @async
 * @param {string} id - Repair request ID.
 * @returns {Promise<RepairItem>}
 */
export async function fetchRepairDetails(id: string): Promise<RepairItem> {
  const { data } = await apiClient.get<{
    success: boolean
    data: { repair: RepairItem }
  }>(`/api/repairs/${id}`)
  return data.data.repair
}

/**
 * @description Creates a new repair request.
 * @async
 * @param {CreateRepairPayload} payload - Form inputs.
 * @returns {Promise<RepairItem>}
 */
export async function createRepairRequest(
  payload: CreateRepairPayload,
): Promise<RepairItem> {
  const { data } = await apiClient.post<{
    success: boolean
    data: { repair: RepairItem }
    message: string
  }>('/api/repairs', payload)
  return data.data.repair
}

/**
 * @description Uploads an image base64 data URI to Cloudinary via backend.
 * @async
 * @param {string} imageData - Data URI.
 * @returns {Promise<ImageAttachment>}
 */
export async function uploadRepairImage(
  imageData: string,
): Promise<ImageAttachment> {
  const { data } = await apiClient.post<{
    success: boolean
    data: ImageAttachment
  }>('/api/repairs/upload-image', { imageData })
  return data.data
}

