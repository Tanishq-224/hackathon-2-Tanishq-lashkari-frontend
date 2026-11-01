import aboutProgressImage from '@/assets/about-accountability-progress.jpg'
import selectTechnicianImage from '@/assets/about-process-select-technician.jpg'
import compareEstimatesImage from '@/assets/devices/why-compare-quotations.jpg'
import devicePhoneImage from '@/assets/devices/device-phone.jpg'
import structuredWorkflowImage from '@/assets/devices/why-structured-workflow.jpg'

export type AboutRepairProcessStep = {
  id: string
  number: string
  title: string
  body: string
  image: string
  imageAlt: string
  /** @description Use contain for wide UI/marketing art so text stays readable. */
  imageFit?: 'cover' | 'contain'
}

/** @description Five-step Repairex journey for the About “Our process” section. */
export const REPAIREX_ABOUT_PROCESS_STEPS: AboutRepairProcessStep[] = [
  {
    id: 'process-01',
    number: '01',
    title: 'Submit a structured request',
    body: 'Describe the device, issue category, and optional photos so every eligible vendor starts from the same brief — not a vague chat thread.',
    image: devicePhoneImage,
    imageAlt: 'Customer documenting a phone repair request with clear device details',
  },
  {
    id: 'process-02',
    number: '02',
    title: 'Compare preliminary estimates',
    body: 'Review side-by-side estimates from vendors before you commit. Pricing, turnaround, and scope stay visible while you decide.',
    image: compareEstimatesImage,
    imageAlt: 'Comparing multiple repair estimates in a structured layout',
  },
  {
    id: 'process-03',
    number: '03',
    title: 'Select your technician',
    body: 'Choose the option that fits your timeline and repair scope. Your assigned vendor follows up with physical diagnosis and an itemized final quotation.',
    image: selectTechnicianImage,
    imageFit: 'contain',
    imageAlt:
      'Choose a technician, then physical diagnosis and an itemized final quotation in the Repairex flow',
  },
  {
    id: 'process-04',
    number: '04',
    title: 'Approve work and track repair',
    body: 'Authorize the final quote before bench work begins, then follow in-repair updates in one dashboard — for customers and vendors alike.',
    image: structuredWorkflowImage,
    imageAlt: 'Structured repair workflow from approval through in-repair status',
  },
  {
    id: 'process-05',
    number: '05',
    title: 'Proof, pickup, and closure',
    body: 'After-repair proof photos, pickup confirmation, and a complete record from first request to resolution — no lost messages or mystery charges.',
    image: aboutProgressImage,
    imageAlt: 'Repair completion proof and accountability through the final handoff',
  },
]
