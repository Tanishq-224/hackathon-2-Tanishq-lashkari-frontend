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
  assignedVendorId?: string
  assignedVendorName?: string
  acceptedEstimateId?: string
  acceptedCostMin?: number
  acceptedCostMax?: number
  quotationId?: string
  finalApprovedAmount?: number
  createdAt: string
  updatedAt: string
}

export type EstimateItem = {
  id: string
  repairRequestId: string
  vendorId: string
  vendorName: string
  vendorEmail: string
  minCost: number
  maxCost: number
  turnaroundTime: string
  warrantyMonths: number
  notes: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
  updatedAt: string
}

export type SubmitEstimatePayload = {
  minCost: number
  maxCost: number
  turnaroundTime: string
  warrantyMonths: number
  notes: string
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
export const marketplaceFeedQueryKey = (filters?: { deviceType?: string; urgency?: string }) =>
  ['marketplace', 'repairs', filters] as const
export const repairEstimatesQueryKey = (repairId: string) =>
  ['repairs', repairId, 'estimates'] as const
export const repairQuotationQueryKey = (repairId: string) =>
  ['repairs', repairId, 'quotation'] as const

export type LineItemCategory = 'parts' | 'labor' | 'consumable' | 'other'

export type QuotationLineItem = {
  description: string
  category: LineItemCategory
  cost: number
}

export type QuotationItem = {
  id: string
  repairRequestId: string
  vendorId: string
  vendorName: string
  diagnosticFindings: string
  lineItems: QuotationLineItem[]
  totalAmount: number
  estimatedCompletion: string
  status: 'pending' | 'approved' | 'rejected'
  customerDecisionAt?: string
  customerFeedback?: string
  createdAt: string
  updatedAt: string
}

export type CreateQuotationPayload = {
  diagnosticFindings: string
  lineItems: QuotationLineItem[]
  estimatedCompletion: string
}

export type QuotationDecisionPayload = {
  decision: 'approved' | 'rejected'
  feedback?: string
}

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

/**
 * @description Fetches all open repair requests available in the vendor marketplace feed.
 * @async
 */
export async function fetchMarketplaceFeed(filters?: {
  deviceType?: string
  urgency?: string
}): Promise<RepairItem[]> {
  const { data } = await apiClient.get<{
    success: boolean
    data: { requests: RepairItem[] }
  }>('/api/marketplace/repairs', { params: filters })
  return data.data.requests
}

/**
 * @description Fetches all estimates submitted for a specific repair request.
 * @async
 */
export async function fetchRepairEstimates(repairId: string): Promise<EstimateItem[]> {
  const { data } = await apiClient.get<{
    success: boolean
    data: { estimates: EstimateItem[] }
  }>(`/api/repairs/${repairId}/estimates`)
  return data.data.estimates
}

/**
 * @description Submits a preliminary vendor estimate for an open repair request.
 * @async
 */
export async function submitEstimateRequest(
  repairId: string,
  payload: SubmitEstimatePayload,
): Promise<EstimateItem> {
  const { data } = await apiClient.post<{
    success: boolean
    data: { estimate: EstimateItem }
    message: string
  }>(`/api/repairs/${repairId}/estimates`, payload)
  return data.data.estimate
}

/**
 * @description Customer selects and accepts a vendor estimate.
 * @async
 */
export async function selectEstimateRequest(
  repairId: string,
  estimateId: string,
): Promise<{ repair: RepairItem; acceptedEstimate: EstimateItem }> {
  const { data } = await apiClient.post<{
    success: boolean
    data: { repair: RepairItem; acceptedEstimate: EstimateItem }
    message: string
  }>(`/api/repairs/${repairId}/select-estimate`, { estimateId })
  return data.data
}

/**
 * @description Fetches the itemized diagnostic quotation for a repair ticket.
 * @async
 */
export async function fetchRepairQuotation(repairId: string): Promise<QuotationItem | null> {
  const { data } = await apiClient.get<{
    success: boolean
    data: { quotation: QuotationItem | null }
  }>(`/api/repairs/${repairId}/quotation`)
  return data.data.quotation
}

/**
 * @description Submits physical diagnostic findings and itemized line items by the assigned vendor.
 * @async
 */
export async function submitDiagnosisRequest(
  repairId: string,
  payload: CreateQuotationPayload,
): Promise<{ quotation: QuotationItem; repair: RepairItem }> {
  const { data } = await apiClient.post<{
    success: boolean
    data: { quotation: QuotationItem; repair: RepairItem }
    message: string
  }>(`/api/repairs/${repairId}/diagnosis`, payload)
  return data.data
}

/**
 * @description Customer approves or rejects an itemized diagnostic quotation.
 * @async
 */
export async function decideQuotationRequest(
  repairId: string,
  payload: QuotationDecisionPayload,
): Promise<{ quotation: QuotationItem; repair: RepairItem; message: string }> {
  const { data } = await apiClient.post<{
    success: boolean
    data: { quotation: QuotationItem; repair: RepairItem; message: string }
    message: string
  }>(`/api/repairs/${repairId}/quotation/decision`, payload)
  return data.data
}


