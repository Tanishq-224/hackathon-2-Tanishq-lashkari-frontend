import type { TimelineJourneyItem } from '@/components/ui/timeline'

/** @description Repairex repair journey milestones for the About horizontal timeline. */
export const REPAIREX_ABOUT_TIMELINE_TOP: TimelineJourneyItem[] = [
  {
    id: 'rx-step-01',
    sortKey: 1,
    headline: '01 · Create request',
    year: '2026',
    month: 'January',
    content:
      'Describe the device, issue, and optional photos so vendors understand the job.',
  },
  {
    id: 'rx-step-02',
    sortKey: 2,
    headline: '02 · Compare estimates',
    year: '2026',
    month: 'February',
    content:
      'Eligible vendors submit preliminary estimates you can review side by side.',
  },
  {
    id: 'rx-step-03',
    sortKey: 3,
    headline: '03 · Select a vendor',
    year: '2026',
    month: 'March',
    content: 'Choose the option that fits your timeline and repair scope.',
  },
  {
    id: 'rx-step-04',
    sortKey: 4,
    headline: '04 · Diagnosis & quote',
    year: '2026',
    month: 'April',
    content:
      'Your technician shares physical findings and an itemized final quotation.',
  },
]

export const REPAIREX_ABOUT_TIMELINE_BOTTOM: TimelineJourneyItem[] = [
  {
    id: 'rx-step-05',
    sortKey: 5,
    headline: '05 · Approve & authorize',
    year: '2026',
    month: 'May',
    content:
      'Approve or decline the final quote before any repair work begins.',
  },
  {
    id: 'rx-step-06',
    sortKey: 6,
    headline: '06 · In repair',
    year: '2026',
    month: 'June',
    content:
      'Assigned vendors update bench progress; customers follow status in one dashboard.',
  },
  {
    id: 'rx-step-07',
    sortKey: 7,
    headline: '07 · Ready & complete',
    year: '2026',
    month: 'July',
    content:
      'Completion proof, pickup confirmation, and a clear record from request to resolution.',
  },
]
