import { Link } from 'react-router-dom'

import contactHeroImage from '@/assets/hero-background.jpg'
import { ScrollExpand } from '@/components/shared/ScrollExpand'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * @description Contact hero with scroll-expand media frame (React Bits pattern).
 * @returns {JSX.Element} Contact hero section.
 */
export function ContactHeroSection() {
  return (
    <section aria-label="Contact Repairex" className="contact-scroll-hero">
      <ScrollExpand
        className="scroll-expand--repairex contact-scroll-hero__stage"
        src={contactHeroImage}
        alt=""
        title="Talk to Repairex support"
        titleAs="h1"
        scrollHint="Scroll"
        useWindowScroll
        startWidth={44}
        startHeight={56}
        startRadius={28}
        endRadius={0}
        mediaZoom={1.32}
        scrollDistance={0.95}
        holdDistance={0.15}
        smoothing={0}
        overlayScrim={0.5}
      >
        <div className="contact-scroll-hero__overlay mx-auto max-w-2xl px-4 text-white">
          <p className="text-ui font-semibold tracking-[0.18em] text-primary uppercase">
            Contact us
          </p>
          <h2 className="mt-4 font-display text-h1 font-bold tracking-tight text-white">
            Every message, one clear path to help
          </h2>
          <p className="mt-4 text-body-lg leading-relaxed text-white/85">
            Repair requests, vendor partnerships, or general support — pick a channel
            below. Active customers also get lifecycle email and in-app alerts for
            estimates, quotes, and pickup.
          </p>
          <Link
            to="#contact-form"
            className={cn(
              buttonVariants({
                size: 'lg',
                className: 'mt-8 h-11 rounded-full px-7',
              }),
            )}
          >
            Jump to contact form
          </Link>
        </div>
      </ScrollExpand>
    </section>
  )
}
