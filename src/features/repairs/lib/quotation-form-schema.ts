import { z } from 'zod'

import { longTextField, shortLabelField } from '@/lib/validation/fields'

const lineItemCategories = ['parts', 'labor', 'consumable', 'other'] as const

export const quotationLineItemSchema = z.object({
  description: z
    .string()
    .trim()
    .min(2, 'Line item description must be at least 2 characters.')
    .max(200, 'Line item description is too long.'),
  category: z.enum(lineItemCategories),
  cost: z.number().min(0, 'Line item cost cannot be negative.'),
})

/**
 * @description Vendor final diagnosis / quotation form — aligned with createQuotationSchema.
 */
export const vendorQuotationFormSchema = z.object({
  diagnosticFindings: longTextField(10, 3000, 'Diagnostic findings'),
  lineItems: z.array(quotationLineItemSchema).min(1, 'Add at least one line item.'),
  estimatedCompletion: shortLabelField(100),
})

export type VendorQuotationFormValues = z.infer<typeof vendorQuotationFormSchema>

export const quotationDeclineFeedbackSchema = z
  .string()
  .trim()
  .max(1000, 'Feedback cannot exceed 1000 characters.')
  .optional()
