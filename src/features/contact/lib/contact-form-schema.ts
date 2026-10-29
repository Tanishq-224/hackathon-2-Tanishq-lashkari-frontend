import { z } from 'zod'

/** @description Contact form topic options shown in the UI. */
export const CONTACT_FORM_TOPICS = [
  { value: 'repair-request', label: 'Repair request' },
  { value: 'vendor', label: 'Vendor partnership' },
  { value: 'support', label: 'Account or order support' },
  { value: 'other', label: 'Something else' },
] as const

/**
 * @description Client-side validation schema for the public contact form.
 */
export const contactFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string().trim().max(24).optional(),
  topic: z.enum(['repair-request', 'vendor', 'support', 'other']),
  message: z
    .string()
    .trim()
    .min(10, 'Add a few more details so we can help.')
    .max(2000, 'Message is too long (2000 characters max).'),
})

/** @description Contact form field values. */
export type ContactFormValues = z.infer<typeof contactFormSchema>
