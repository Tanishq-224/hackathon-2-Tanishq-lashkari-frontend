/** @description Shared repair workflow copy for home and about pages. */
export const REPAIR_WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Create your request',
    description:
      'Describe the device, issue, and optional photos so vendors understand the job.',
  },
  {
    step: '02',
    title: 'Compare estimates',
    description:
      'Eligible vendors submit preliminary estimates you can review side by side.',
  },
  {
    step: '03',
    title: 'Select a vendor',
    description: 'Choose the option that fits your timeline and repair scope.',
  },
  {
    step: '04',
    title: 'Review diagnosis & quote',
    description:
      'The selected vendor shares findings and an itemized final quotation.',
  },
  {
    step: '05',
    title: 'Approve and track',
    description:
      'Approve or reject the final quote, then follow repair status updates in your dashboard.',
  },
] as const
