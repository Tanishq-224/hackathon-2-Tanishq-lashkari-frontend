import { apiClient } from '@/lib/api-client'
import type { ContactFormValues } from '@/features/contact/lib/contact-form-schema'

type ContactSubmitResponse = {
  success: boolean
  message: string
  data?: {
    receivedAt: string
  }
}

/**
 * @description Sends the public contact form to the Repairex API.
 * @async
 * @param {ContactFormValues} payload - Validated form values.
 * @returns {Promise<ContactSubmitResponse>} API success envelope.
 * @throws {Error} When the network request fails or the API returns an error.
 */
export async function submitContactMessage(
  payload: ContactFormValues,
): Promise<ContactSubmitResponse> {
  const { data } = await apiClient.post<ContactSubmitResponse>(
    '/api/contact',
    {
      ...payload,
      phone: payload.phone?.trim() ? payload.phone.trim() : undefined,
    },
  )

  return data
}
