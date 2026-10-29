import aboutBrandHero from '@/assets/about-brand-hero.jpg'
import aboutHeroBackground from '@/assets/hero-background.jpg'
import { ScrollExpandMedia } from '@/components/ui/scroll-expansion-hero'
import { AboutExpandHeroPanel } from '@/features/about/components/editorial/AboutExpandHeroPanel'

/**
 * @description About hero — scroll-expansion-hero layout with Contact-matched scroll smoothness.
 * @returns {JSX.Element} About scroll expansion hero.
 */
export function AboutEditorialScrollHero() {
  return (
    <div className="about-scroll-hero">
      <ScrollExpandMedia
        ariaLabel="About Repairex"
        className="bg-[#08090b]"
        mediaType="image"
        mediaSrc={aboutBrandHero}
        bgImageSrc={aboutHeroBackground}
        title="We are a repair marketplace rooted in clarity"
        date="About Repairex"
        scrollToExpand="Scroll"
        scrollDistance={0.95}
        holdDistance={0.15}
        smoothing={0}
        mediaZoom={1.32}
        overlayScrim={0.52}
      >
        <AboutExpandHeroPanel />
      </ScrollExpandMedia>
    </div>
  )
}
