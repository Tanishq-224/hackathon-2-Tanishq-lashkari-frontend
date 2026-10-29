import { MarketingFaqAccordion } from '@/components/shared/MarketingFaqAccordion'
import { PageSection } from '@/components/shared/PageSection'

const supportFaqs = [
  {
    id: 'contact-response-time',
    question: 'How quickly will someone reply?',
    answer:
      'During support hours we aim to respond within one business day. Messages sent outside hours are queued for the next available window.',
  },
  {
    id: 'contact-repair-details',
    question: 'What should I include for a repair request?',
    answer:
      'Share the device type, symptoms, when the issue started, and any photos that show damage or error messages. That helps vendors respond with useful estimates.',
  },
  {
    id: 'contact-phone-vs-form',
    question: 'Should I call or use the form?',
    answer:
      'Use the form when you want a written record tied to your email. Call for urgent clarifications during support hours using the phone number above.',
  },
  {
    id: 'contact-vendors',
    question: 'I am a repair vendor — how do I join?',
    answer:
      'Choose “Vendor partnership” as the topic and describe your shop location and device specialties. Onboarding flows will expand in later product phases.',
  },
] as const

/**
 * @description Support-focused FAQ accordion for the contact page.
 * @returns {JSX.Element} Contact FAQ section.
 */
export function ContactFaqSection() {
  return (
    <PageSection
      tone="band"
      ariaLabel="Support frequently asked questions"
      revealClassName="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16"
    >
      <div className="max-w-md lg:sticky lg:top-28 lg:self-start">
        <h2 className="font-display text-h1 font-bold tracking-tight text-foreground">
          Support FAQs
        </h2>
        <p className="mt-5 text-body-lg leading-relaxed text-muted-foreground">
          Quick answers about response times, what to send us, and how vendors
          can reach out.
        </p>
      </div>
      <MarketingFaqAccordion items={supportFaqs} />
    </PageSection>
  )
}
