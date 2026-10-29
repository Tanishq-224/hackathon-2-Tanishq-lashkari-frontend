import { Clock, Mail, MapPin, Phone } from 'lucide-react'

import { MarketingPanel } from '@/components/shared/MarketingPanel'
import { PageSection } from '@/components/shared/PageSection'
import { ScrollFadeIn } from '@/components/shared/ScrollFadeIn'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { SITE_CONTACT } from '@/lib/site-contact'

const channels = [
  {
    icon: Phone,
    title: 'Phone',
    body: SITE_CONTACT.phoneDisplay,
    href: SITE_CONTACT.phoneHref,
  },
  {
    icon: Mail,
    title: 'Email',
    body: SITE_CONTACT.email,
    href: SITE_CONTACT.emailHref,
  },
  {
    icon: MapPin,
    title: 'Service hub',
    body: SITE_CONTACT.addressShort,
    href: SITE_CONTACT.mapDirectionsUrl,
    external: true,
  },
  {
    icon: Clock,
    title: 'Support hours',
    body: SITE_CONTACT.supportHours,
    href: undefined,
  },
] as const

/**
 * @description Verified-style contact details and support channels (demo placeholders in site-contact).
 * @returns {JSX.Element} Contact information grid.
 */
export function ContactInfoSection() {
  return (
    <PageSection tone="band" ariaLabel="Contact information and support channels">
      <SectionHeader
        eyebrow="Reach us"
        title="Support channels"
        description="Reach Repairex by phone, email, or visit during support hours. Details stay in sync with the site footer."
      />
      <ScrollFadeIn
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        delay={0.1}
        stagger={0.07}
      >
        {channels.map(({ icon: Icon, title, body, href, ...rest }) => {
          const external = 'external' in rest && rest.external

          return (
            <MarketingPanel
              key={title}
              className="flex h-full flex-col p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <Icon aria-hidden className="size-[1.125rem]" strokeWidth={2.1} />
              </span>
              <h3 className="mt-3 font-display text-h3 font-semibold text-foreground">
                {title}
              </h3>
              {href ? (
                <a
                  href={href}
                  {...(external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="mt-2 text-body text-primary underline-offset-4 hover:underline"
                >
                  {body}
                </a>
              ) : (
                <p className="mt-2 text-body text-muted-foreground">{body}</p>
              )}
            </MarketingPanel>
          )
        })}
      </ScrollFadeIn>
    </PageSection>
  )
}
