import { z } from 'zod'

import { getStartRepairRequestPath } from '@/lib/repair-entry'

/** @description Topics submitted via the public contact API (platform team only). */
export const CONTACT_FORM_PLATFORM_TOPICS = [
  { value: 'platform', label: 'Platform or general inquiry' },
  { value: 'vendor', label: 'Vendor partnership' },
  { value: 'other', label: 'Something else' },
] as const

export type ContactPlatformTopic = (typeof CONTACT_FORM_PLATFORM_TOPICS)[number]['value']
export type ContactAppRouteTopic = 'repair-request' | 'support'

const platformTopicValues = CONTACT_FORM_PLATFORM_TOPICS.map((item) => item.value) as [
  ContactPlatformTopic,
  ...ContactPlatformTopic[],
]

/**
 * @description Client-side validation schema for the public contact form.
 */
export const contactFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string().trim().max(24).optional(),
  topic: z.enum(platformTopicValues),
  message: z
    .string()
    .trim()
    .min(10, 'Add a few more details so we can help.')
    .max(2000, 'Message is too long (2000 characters max).'),
})

/** @description Contact form field values. */
export type ContactFormValues = z.infer<typeof contactFormSchema>

/**
 * @description Dashboard vs login URL for repair and account flows from Contact page.
 * @param {ContactAppRouteTopic} topic - Repair or account shortcut.
 * @param {boolean} isAuthenticated - Whether the visitor has an active session.
 * @returns {string} In-app path.
 */
export function getContactAppRoutePath(
  topic: ContactAppRouteTopic,
  isAuthenticated: boolean,
): string {
  if (topic === 'repair-request') {
    return getStartRepairRequestPath(isAuthenticated)
  }

  const destination = '/dashboard'

  if (isAuthenticated) {
    return destination
  }

  return `/login?redirect=${encodeURIComponent(destination)}`
}
