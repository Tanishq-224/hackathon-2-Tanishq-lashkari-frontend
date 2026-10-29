import { AudienceSection } from '@/features/home/components/AudienceSection'
import { CommonProblemsSection } from '@/features/home/components/CommonProblemsSection'
import { DeviceCategoriesSection } from '@/features/home/components/DeviceCategoriesSection'
import { HomeFaqSection } from '@/features/home/components/HomeFaqSection'
import { HomeFinalCtaSection } from '@/features/home/components/HomeFinalCtaSection'
import { HomeHeroSection } from '@/features/home/components/HomeHeroSection'
import { HowItWorksSection } from '@/features/home/components/HowItWorksSection'
import { WhyChooseSection } from '@/features/home/components/WhyChooseSection'

/**
 * @description Public home page composed of eight brief-defined marketing sections.
 * @returns {JSX.Element} Full Repairex home page.
 */
export function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <HomeHeroSection />
      <DeviceCategoriesSection />
      <CommonProblemsSection />
      <HowItWorksSection />
      <WhyChooseSection />
      <AudienceSection />
      <HomeFaqSection />
      <HomeFinalCtaSection />
    </main>
  )
}
