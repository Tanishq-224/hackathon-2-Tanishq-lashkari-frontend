import { MapPin } from 'lucide-react'

import { MarketingPanel } from '@/components/shared/MarketingPanel'
import { PageSection } from '@/components/shared/PageSection'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { SITE_CONTACT } from '@/lib/site-contact'

/**
 * @description Embedded map and address for the Repairex service location.
 * @returns {JSX.Element} Contact page map section.
 */
export function ContactMapSection() {
  return (
    <PageSection tone="band" ariaLabel="Service location map">
      <SectionHeader
        eyebrow="Visit us"
        title="Find us on the map"
        description="Service hub location in Indore — open directions in your maps app when you are ready to visit."
      />

      <MarketingPanel className="mt-10 overflow-hidden p-0">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,17rem)]">
          <div className="relative min-h-[16rem] sm:min-h-[20rem] lg:min-h-[22rem]">
            <iframe
              title="Repairex service location map"
              src={SITE_CONTACT.mapEmbedUrl}
              className="absolute inset-0 size-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <aside className="flex flex-col justify-center gap-4 border-t border-border bg-card p-6 lg:border-t-0 lg:border-l">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <MapPin aria-hidden className="size-5" strokeWidth={2.1} />
            </span>
            <div>
              <h3 className="font-display text-h3 font-semibold text-foreground">
                Repairex service hub
              </h3>
              <address className="mt-2 space-y-0.5 text-body not-italic text-muted-foreground">
                {SITE_CONTACT.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>
            <a
              href={SITE_CONTACT.mapDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-ui font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Get directions
            </a>
            <p className="text-caption text-muted-foreground">
              {SITE_CONTACT.supportHours}
            </p>
          </aside>
        </div>
      </MarketingPanel>
    </PageSection>
  )
}
