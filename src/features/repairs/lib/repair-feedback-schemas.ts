import { z } from 'zod'

import { optionalFeedbackField } from '@/lib/validation/fields'

/** @description Customer optional reason when rejecting an estimate. */
export const rejectEstimateReasonSchema = z
  .string()
  .trim()
  .max(500, 'Reason cannot exceed 500 characters.')
  .optional()
  .transform((value) => (value === '' ? undefined : value))

/** @description Customer feedback when declining a final quotation. */
export const quotationDeclineFeedbackSchema = optionalFeedbackField
