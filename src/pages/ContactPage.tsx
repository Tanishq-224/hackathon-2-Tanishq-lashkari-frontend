import { ContactFaqSection } from '@/features/contact/components/ContactFaqSection'
import { ContactFormSection } from '@/features/contact/components/ContactFormSection'
import { ContactFinalCtaSection } from '@/features/contact/components/ContactFinalCtaSection'
import { ContactMapSection } from '@/features/contact/components/ContactMapSection'
import { ContactHeroSection } from '@/features/contact/components/ContactHeroSection'
import { ContactInfoSection } from '@/features/contact/components/ContactInfoSection'

/**
 * @description Contact Us page with hero, details, form, FAQs, and location map.
 * @returns {JSX.Element} Full Repairex contact page.
 */
export function ContactPage() {
  return (
    <main className="flex flex-1 flex-col">
      <ContactHeroSection />
      <ContactInfoSection />
      <ContactFormSection />
      <ContactFaqSection />
      <ContactMapSection />
      <ContactFinalCtaSection />
    </main>
  )
}
