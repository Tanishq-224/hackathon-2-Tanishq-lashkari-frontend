import { z } from 'zod'

import { longTextField, shortLabelField } from '@/lib/validation/fields'

const componentLineSchema = z.object({
  component: z
    .string()
    .trim()
    .min(2, 'Component name must be at least 2 characters.')
    .max(120, 'Component name is too long.'),
  price: z.number().positive('Each component price must be greater than zero.'),
  warrantyMonths: z
    .number()
    .int('Warranty months must be a whole number.')
    .min(0, 'Warranty cannot be negative.')
    .max(60, 'Warranty cannot exceed 60 months.'),
})

/**
 * @description Vendor dynamic estimate form — aligned with backend dynamicEstimateFields.
 */
export const dynamicEstimateFormSchema = z.object({
  componentLines: z
    .array(componentLineSchema)
    .min(1, 'Add at least one possible damage component.'),
  labourCost: z.number().min(0, 'Labour cost cannot be negative.'),
  turnaroundTime: shortLabelField(100),
  notes: longTextField(5, 2000, 'Repair description'),
})

export type DynamicEstimateFormValues = z.infer<typeof dynamicEstimateFormSchema>
