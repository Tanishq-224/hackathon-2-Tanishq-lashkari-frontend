import { z } from 'zod'

import type { DeviceType, IssueCategory, Urgency } from '@/features/repairs/api/repairsApi'
import {
  deviceBrandField,
  deviceModelField,
  longTextField,
} from '@/lib/validation/fields'

const DEVICE_TYPES = [
  'phone',
  'laptop',
  'tablet',
  'audio',
  'smartwatch',
  'other',
] as const satisfies readonly DeviceType[]

const ISSUE_CATEGORIES = [
  'screen',
  'battery',
  'charging',
  'water_damage',
  'audio',
  'software',
  'camera',
  'hardware',
  'other',
] as const satisfies readonly IssueCategory[]

const URGENCIES = ['low', 'medium', 'high', 'immediate'] as const satisfies readonly Urgency[]

const imageAttachmentSchema = z.object({
  url: z.string().min(1),
  publicId: z.string().optional(),
})

/**
 * @description Client repair request payload — aligned with backend createRepairSchema.
 */
export const createRepairFormSchema = z.object({
  deviceType: z.enum(DEVICE_TYPES),
  brand: deviceBrandField,
  modelName: deviceModelField,
  issueCategory: z.enum(ISSUE_CATEGORIES),
  description: longTextField(10, 3000, 'Problem description'),
  urgency: z.enum(URGENCIES),
  images: z.array(imageAttachmentSchema).max(5),
})

export type CreateRepairFormValues = z.infer<typeof createRepairFormSchema>
