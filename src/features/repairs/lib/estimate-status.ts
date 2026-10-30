import type { EstimateItem } from '@/features/repairs/api/repairsApi'

export function isEstimateActionable(status: EstimateItem['status']): boolean {
  return status === 'pending'
}

export function estimateStatusLabel(status: EstimateItem['status']): string | null {
  switch (status) {
    case 'pending':
      return null
    case 'accepted':
      return 'Accepted'
    case 'declined':
      return 'Declined'
    case 'withdrawn':
      return 'Withdrawn'
    default:
      return null
  }
}
