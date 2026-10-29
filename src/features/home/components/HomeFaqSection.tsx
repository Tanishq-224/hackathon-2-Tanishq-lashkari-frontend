import { MarketingFaqAccordion } from '@/components/shared/MarketingFaqAccordion'
import { PageSection } from '@/components/shared/PageSection'

const faqs = [
  {
    id: 'faq-estimates',
    question: 'What is the difference between an estimate and a final quote?',
    answer:
      'Vendors first share preliminary estimates based on your request details. After you select a vendor, they inspect the device and provide an itemized final quotation for your approval.',
  },
  {
    id: 'faq-approval',
    question: 'Do I have to approve repairs before work starts?',
    answer:
      'Yes. Repairex is built around informed approval. Final repair work proceeds only after you review the diagnosis and accept the final quotation.',
  },
  {
    id: 'faq-tracking',
    question: 'Can I track my repair status?',
    answer:
      'Once a repair is approved, vendors update progress and you can follow the latest status and history from your customer dashboard.',
  },
  {
    id: 'faq-devices',
    question: 'Which devices can I submit?',
    answer:
      'The MVP supports phones, laptops, and tablets. Submit details and photos that match the supported categories so vendors can respond accurately.',
  },
] as const

/**
 * @description FAQ section with editorial two-column layout and animated accordion.
 * @returns {JSX.Element} Home FAQ section.
 */
export function HomeFaqSection() {
  return (
    <PageSection
      id="faq"
      tone="canvas"
      ariaLabel="Frequently asked questions"
      revealClassName="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16 xl:gap-24"
    >
      <div className="max-w-md lg:sticky lg:top-28 lg:self-start">
        <h2 className="font-display text-h1 font-bold tracking-tight text-foreground">
          Frequently asked questions
        </h2>
        <p className="mt-5 text-body-lg leading-relaxed text-muted-foreground">
          Straight answers about estimates, approval, and tracking — so you know
          what happens before you hand over a device or approve a quote.
        </p>
      </div>

      <MarketingFaqAccordion
        items={faqs}
        defaultOpenId="faq-estimates"
        className="lg:pt-1"
      />
    </PageSection>
  )
}
