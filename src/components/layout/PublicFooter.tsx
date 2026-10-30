import { ChevronDown, Mail, MapPin, Phone } from 'lucide-react'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { Container } from '@/components/shared/Container'
import { useAuthSession } from '@/hooks/useAuthSession'
import { useGsapAccordionPanel } from '@/hooks/useGsapAccordionPanel'
import { SITE_CONTACT } from '@/lib/site-contact'
import { cn } from '@/lib/utils'

const exploreLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const

const accountLinks = [
  { to: '/login', label: 'Log in' },
  { to: '/signup', label: 'Sign up' },
] as const

type FooterLink = {
  to: string
  label: string
  external?: boolean
}

type FooterLinkGroupProps = {
  title: string
  links: readonly FooterLink[]
}

/**
 * @description Shared list markup for footer navigation links.
 * @param {object} props - Link entries and optional className.
 * @returns {JSX.Element}
 */
function FooterLinksList({
  links,
  className,
}: {
  links: readonly FooterLink[]
  className?: string
}) {
  return (
    <ul className={cn('space-y-2.5', className)}>
      {links.map(({ to, label, external }) => (
        <li key={label}>
          {external ? (
            <a
              href={to}
              className="text-body text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </a>
          ) : (
            <Link
              to={to}
              className="text-body text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}

/**
 * @description Renders a titled column of footer navigation links (tablet+).
 * @param {FooterLinkGroupProps} props - Column heading and link list.
 * @returns {JSX.Element} Footer link column.
 */
function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div>
      <h2 className="text-ui font-semibold text-foreground">{title}</h2>
      <FooterLinksList links={links} className="mt-4" />
    </div>
  )
}

/**
 * @description Contact details list shared by mobile accordion and desktop column.
 * @returns {JSX.Element}
 */
function FooterContactList({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        'space-y-2.5 text-caption text-muted-foreground',
        className,
      )}
    >
      <li>
        <a
          href={SITE_CONTACT.phoneHref}
          className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
        >
          <Phone aria-hidden className="size-3.5 shrink-0 text-primary" />
          <span>{SITE_CONTACT.phoneDisplay}</span>
        </a>
      </li>
      <li>
        <a
          href={SITE_CONTACT.emailHref}
          className="inline-flex items-start gap-2 break-all transition-colors hover:text-foreground"
        >
          <Mail aria-hidden className="mt-0.5 size-3.5 shrink-0 text-primary" />
          <span>{SITE_CONTACT.email}</span>
        </a>
      </li>
      <li className="flex gap-2">
        <MapPin aria-hidden className="mt-0.5 size-3.5 shrink-0 text-primary" />
        <address className="not-italic leading-snug">
          {SITE_CONTACT.addressShort}
        </address>
      </li>
      <li className="leading-snug">{SITE_CONTACT.supportHours}</li>
    </ul>
  )
}

/**
 * @description Compact contact column for the footer link grid.
 * @returns {JSX.Element} Footer contact block.
 */
function FooterContactColumn() {
  return (
    <div>
      <h2 className="text-ui font-semibold text-foreground">Contact</h2>
      <FooterContactList className="mt-4" />
    </div>
  )
}

type FooterAccordionRowProps = {
  id: string
  title: string
  open: boolean
  reducedMotion: boolean
  onToggle: (id: string) => void
  children: ReactNode
}

/**
 * @description One footer nav section with GSAP height fade for open/close.
 * @param {FooterAccordionRowProps} props - Section label, state, and panel content.
 * @returns {JSX.Element}
 */
function FooterAccordionRow({
  id,
  title,
  open,
  reducedMotion,
  onToggle,
  children,
}: FooterAccordionRowProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  useGsapAccordionPanel(panelRef, innerRef, { open, reducedMotion })

  return (
    <div className="border-b border-border/80 px-4 last:border-b-0">
      <button
        type="button"
        id={`${panelId}-trigger`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onToggle(id)}
        className="flex w-full items-center justify-between gap-3 py-3.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className="text-ui font-semibold text-foreground">{title}</span>
        <ChevronDown
          aria-hidden
          className={cn(
            'size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-out',
            open && 'rotate-180',
          )}
        />
      </button>
      <div
        id={panelId}
        ref={panelRef}
        role="region"
        aria-labelledby={`${panelId}-trigger`}
        hidden={!open && reducedMotion}
        className="overflow-hidden"
      >
        <div ref={innerRef} className="pb-4">
          {children}
        </div>
      </div>
    </div>
  )
}

type FooterMobileNavAccordionProps = {
  accountLinks: readonly FooterLink[]
}

/**
 * @description Collapsible Explore / Account / Contact sections on small screens.
 * @param {FooterMobileNavAccordionProps} props - Account links for auth state.
 * @returns {JSX.Element}
 */
function FooterMobileNavAccordion({ accountLinks }: FooterMobileNavAccordionProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set())
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncReducedMotion = () => setReducedMotion(mediaQuery.matches)
    syncReducedMotion()
    mediaQuery.addEventListener('change', syncReducedMotion)
    return () => mediaQuery.removeEventListener('change', syncReducedMotion)
  }, [])

  const toggleSection = (sectionId: string) => {
    setOpenSections((previous) => {
      const next = new Set(previous)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border/80 sm:hidden">
      <FooterAccordionRow
        id="explore"
        title="Explore"
        open={openSections.has('explore')}
        reducedMotion={reducedMotion}
        onToggle={toggleSection}
      >
        <FooterLinksList links={exploreLinks} />
      </FooterAccordionRow>
      <FooterAccordionRow
        id="account"
        title="Account"
        open={openSections.has('account')}
        reducedMotion={reducedMotion}
        onToggle={toggleSection}
      >
        <FooterLinksList links={accountLinks} />
      </FooterAccordionRow>
      <FooterAccordionRow
        id="contact"
        title="Contact"
        open={openSections.has('contact')}
        reducedMotion={reducedMotion}
        onToggle={toggleSection}
      >
        <FooterContactList />
      </FooterAccordionRow>
    </div>
  )
}

type SocialIconProps = {
  name: 'x' | 'instagram' | 'linkedin'
}

/**
 * @description Monochrome social glyph for the footer icon row.
 * @param {SocialIconProps} props - Which network icon to render.
 * @returns {JSX.Element} SVG icon.
 */
function SocialIcon({ name }: SocialIconProps) {
  if (name === 'x') {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className="size-[1.125rem]" fill="currentColor">
        <path d="M17.3 3h3.2l-7 8.1 8.2 10.8h-6.4l-5-6.5-5.7 6.5H1.4l7.5-8.6L1 3h6.6l4.5 5.9L17.3 3Zm-1.1 16.2h1.8L7.1 4.9H5.2l11 14.3Z" />
      </svg>
    )
  }

  if (name === 'instagram') {
    return (
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="size-[1.125rem]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      >
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="3.75" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-[1.125rem]" fill="currentColor">
      <path d="M6.5 8.5h-3V21h3V8.5ZM4.75 3a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5ZM21 14.6c0-4.1-2.2-6-5.1-6-2.35 0-3.4 1.3-4 2.2v-1.9h-3V21h3v-5.6c0-2 0-4.6 2.8-4.6 2.4 0 2.4 2.2 2.4 4.5V21h3v-6.4Z" />
    </svg>
  )
}

type SocialLinkProps = {
  href: string
  label: string
  icon: SocialIconProps['name']
}

/**
 * @description Accessible social profile link with icon-only control.
 * @param {SocialLinkProps} props - URL, accessible name, and icon key.
 * @returns {JSX.Element} Social media anchor.
 */
function SocialLink({ href, label, icon }: SocialLinkProps) {
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      target="_blank"
      rel="noreferrer"
    >
      <SocialIcon name={icon} />
    </a>
  )
}

/**
 * @description Social links row shown under the footer brand blurb.
 * @returns {JSX.Element} Footer social media links.
 */
function FooterSocialLinks() {
  return (
    <div className="mt-4 flex items-center gap-1 sm:mt-5">
      <SocialLink href="https://twitter.com" label="Repairex on X" icon="x" />
      <SocialLink
        href="https://instagram.com"
        label="Repairex on Instagram"
        icon="instagram"
      />
      <SocialLink
        href="https://linkedin.com"
        label="Repairex on LinkedIn"
        icon="linkedin"
      />
    </div>
  )
}

/**
 * @description Reference-style footer with faded brand watermark and Repairex content.
 * @returns {JSX.Element} Public site footer.
 */
export function PublicFooter() {
  const { isAuthenticated } = useAuthSession()

  const dynamicAccountLinks: readonly FooterLink[] = isAuthenticated
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/dashboard/new-repair', label: 'New Repair' },
      ]
    : accountLinks

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border bg-background">
      <Container className="relative z-10 pt-8 pb-4 sm:pt-14 sm:pb-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)] lg:gap-16">
          <div className="max-w-md">
            <Link
              to="/"
              className="font-display text-h2 font-bold tracking-tight text-foreground"
            >
              Repairex
            </Link>
            <p className="mt-2 max-w-xs text-body text-muted-foreground sm:mt-3">
              Compare repair estimates, approve final quotes, and track your device
              repair in one transparent marketplace workflow.
            </p>
            <FooterSocialLinks />
          </div>

          <FooterMobileNavAccordion accountLinks={dynamicAccountLinks} />

          <div className="hidden gap-8 sm:grid sm:grid-cols-3 sm:gap-8">
            <FooterLinkGroup title="Explore" links={exploreLinks} />
            <FooterLinkGroup title="Account" links={dynamicAccountLinks} />
            <FooterContactColumn />
          </div>
        </div>
      </Container>

      <div
        aria-hidden
        className="relative z-0 flex justify-center overflow-hidden px-4 pb-0 pt-2 sm:pb-2 sm:pt-6"
      >
        <p
          className={cn(
            'footer-brand-watermark font-display text-center font-bold leading-[0.85] tracking-tight',
            'text-[clamp(3.25rem,18vw,13.5rem)] text-foreground/25 dark:text-foreground/20',
          )}
        >
          Repairex
        </p>
      </div>

      <div className="relative z-10 border-t border-border/70">
        <Container className="py-4 text-caption text-muted-foreground sm:py-6">
          <p>© {new Date().getFullYear()} Repairex. Demo contact details for development.</p>
        </Container>
      </div>
    </footer>
  )
}
