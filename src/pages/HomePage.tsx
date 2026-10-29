import { ScrollFadeIn } from '@/components/shared/ScrollFadeIn'
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

      <ScrollFadeIn distance={24} duration={0.65} delay={0} stagger={0.1}>
        <DeviceCategoriesSection />
      </ScrollFadeIn>

      <ScrollFadeIn distance={24} duration={0.65} delay={0} stagger={0.1}>
        <CommonProblemsSection />
      </ScrollFadeIn>

      <ScrollFadeIn distance={24} duration={0.65} delay={0} stagger={0.08}>
        <HowItWorksSection />
      </ScrollFadeIn>

      {/* No ScrollFadeIn wrapper — GSAP pin + horizontal scrub need a visible, untransformed root */}
      <WhyChooseSection />

      <ScrollFadeIn distance={24} duration={0.65} delay={0} stagger={0.1}>
        <AudienceSection />
      </ScrollFadeIn>

      <ScrollFadeIn distance={24} duration={0.65} delay={0} stagger={0.1}>
        <HomeFaqSection />
      </ScrollFadeIn>

      <ScrollFadeIn distance={20} duration={0.65} delay={0}>
        <HomeFinalCtaSection />
      </ScrollFadeIn>
    </main>
  )
}
