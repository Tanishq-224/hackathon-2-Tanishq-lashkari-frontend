import { z } from 'zod'

import { getStartRepairRequestPath } from '@/lib/repair-entry'
import {
  emailField,
  longTextField,
  optionalPhoneField,
  personNameField,
} from '@/lib/validation/fields'

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

export const contactFormSchema = z.object({
  fullName: personNameField,
  email: emailField,
  phone: optionalPhoneField,
  topic: z.enum(platformTopicValues),
  message: longTextField(10, 2000, 'Message'),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>

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
