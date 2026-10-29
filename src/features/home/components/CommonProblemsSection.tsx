import { Battery, Cpu, PlugZap, Smartphone, type LucideIcon } from 'lucide-react'

import { PageSection } from '@/components/shared/PageSection'
import { SectionHeader } from '@/components/shared/SectionHeader'
import deviceLifestyle from '@/assets/devices/device-lifestyle.jpg'
import devicePhone from '@/assets/devices/device-phone.jpg'
import heroBackground from '@/assets/hero-background.jpg'
import { cn } from '@/lib/utils'

const problems = [
  {
    key: 'screens',
    title: 'Cracked or unresponsive screens',
    description:
      'Display damage, touch issues, and glass replacement for phones, tablets, and laptops.',
    icon: Smartphone,
    image: devicePhone,
    imageAlt: 'Smartphone with screen damage ready for repair assessment',
  },
  {
    key: 'battery',
    title: 'Battery and power problems',
    description:
      'Fast drain, sudden shutdowns, swelling concerns, and replacement with clear scope.',
    icon: Battery,
    image: deviceLifestyle,
    imageAlt: 'Device battery and power troubleshooting',
  },
  {
    key: 'charging',
    title: 'Charging and port faults',
    description:
      'Loose ports, cable detection issues, and charging circuitry diagnosis.',
    icon: PlugZap,
  },
  {
    key: 'hardware',
    title: 'Hardware and board faults',
    description:
      'Speaker, camera, storage, and component-level issues after structured inspection.',
    icon: Cpu,
  },
] as const

type BentoIconBadgeProps = {
  icon: LucideIcon
  className?: string
  variant?: 'primary' | 'on-image'
}

/**
 * @description Circular accent icon badge used on common-issues bento tiles.
 * @param {BentoIconBadgeProps} props - Icon component and visual variant.
 * @returns {JSX.Element} Round icon badge.
 */
function BentoIconBadge({
  icon: Icon,
  className,
  variant = 'primary',
}: BentoIconBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex size-12 items-center justify-center rounded-full',
        variant === 'primary' && 'bg-primary text-primary-foreground shadow-md',
        variant === 'on-image' &&
          'border border-white/25 bg-primary text-primary-foreground shadow-lg',
        className,
      )}
    >
      <Icon aria-hidden className="size-5" strokeWidth={2} />
    </span>
  )
}

type CommonIssuesFeatureTileProps = {
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  icon: LucideIcon
  className?: string
}

/**
 * @description Large image bento tile with centered icon and frosted footer copy.
 * @param {CommonIssuesFeatureTileProps} props - Tile content and imagery.
 * @returns {JSX.Element} Feature bento tile.
 */
function CommonIssuesFeatureTile({
  title,
  description,
  imageSrc,
  imageAlt,
  icon,
  className,
}: CommonIssuesFeatureTileProps) {
  return (
    <article
      className={cn(
        'relative min-h-[280px] overflow-hidden rounded-[1.75rem] lg:min-h-full',
        className,
      )}
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        className="absolute inset-0 size-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <BentoIconBadge icon={icon} variant="on-image" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md sm:p-5">
          <h3 className="font-display text-h3 font-semibold text-white">{title}</h3>
          <p className="mt-2 text-body text-white/85">{description}</p>
        </div>
      </div>
    </article>
  )
}

type CommonIssuesImageTileProps = {
  title: string
  imageSrc: string
  imageAlt: string
  className?: string
}

/**
 * @description Compact image-only bento tile for the middle column stack.
 * @param {CommonIssuesImageTileProps} props - Tile image and accessible label.
 * @returns {JSX.Element} Image bento tile.
 */
function CommonIssuesImageTile({
  title,
  imageSrc,
  imageAlt,
  className,
}: CommonIssuesImageTileProps) {
  return (
    <article
      className={cn(
        'relative min-h-[200px] overflow-hidden rounded-[1.75rem] sm:min-h-[220px]',
        className,
      )}
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        className="absolute inset-0 size-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <p className="absolute inset-x-0 bottom-0 p-4 font-display text-h3 font-semibold text-white">
        {title}
      </p>
    </article>
  )
}

type CommonIssuesAccentTileProps = {
  title: string
  description: string
  icon: LucideIcon
  className?: string
}

/**
 * @description Solid primary accent bento tile matching the reference highlight card.
 * @param {CommonIssuesAccentTileProps} props - Accent tile copy and icon.
 * @returns {JSX.Element} Accent bento tile.
 */
function CommonIssuesAccentTile({
  title,
  description,
  icon,
  className,
}: CommonIssuesAccentTileProps) {
  return (
    <article
      className={cn(
        'flex min-h-[200px] flex-col items-center justify-center rounded-[1.75rem] bg-primary px-5 py-8 text-center text-primary-foreground sm:min-h-[220px]',
        className,
      )}
    >
      <BentoIconBadge
        icon={icon}
        className="bg-primary-foreground/15 text-primary-foreground"
      />
      <h3 className="mt-5 font-display text-h3 font-bold">{title}</h3>
      <p className="mt-2 max-w-xs text-body text-primary-foreground/90">
        {description}
      </p>
    </article>
  )
}

type CommonIssuesStatTileProps = {
  stat: string
  title: string
  description: string
  icon: LucideIcon
  imageSrc: string
  imageAlt: string
  className?: string
}

/**
 * @description Tall stat bento tile with blurred imagery and foreground metrics.
 * @param {CommonIssuesStatTileProps} props - Stat tile content and background image.
 * @returns {JSX.Element} Stat bento tile.
 */
function CommonIssuesStatTile({
  stat,
  title,
  description,
  icon,
  imageSrc,
  imageAlt,
  className,
}: CommonIssuesStatTileProps) {
  return (
    <article
      className={cn(
        'relative flex min-h-[320px] flex-col overflow-hidden rounded-[1.75rem] p-6 sm:min-h-[360px] sm:p-8 lg:min-h-full',
        className,
      )}
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        aria-hidden={imageAlt === ''}
        className="absolute inset-0 size-full scale-105 object-cover blur-sm"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-[#0f1115]/55" />
      <div className="relative z-10 flex flex-col items-center text-center">
        <BentoIconBadge icon={icon} variant="on-image" />
        <p className="mt-8 font-display text-[clamp(3rem,8vw,4.5rem)] font-bold leading-none text-white">
          {stat}
        </p>
        <h3 className="mt-4 font-display text-h3 font-semibold text-white">
          {title}
        </h3>
        <p className="mt-3 max-w-xs text-body text-white/85">{description}</p>
      </div>
    </article>
  )
}

/**
 * @description Highlights frequent repair issues in a reference-style bento grid.
 * @returns {JSX.Element} Common problems section.
 */
export function CommonProblemsSection() {
  const [screens, battery, charging, hardware] = problems

  return (
    <PageSection tone="band" ariaLabel="Common repair problems" scrollReveal={false}>
      <SectionHeader
        eyebrow="Common Issues"
        title="Problems we help you solve"
        description="Start with the symptom you see today. Vendors respond with preliminary estimates before any final repair quote."
      />

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2 lg:gap-5">
        <CommonIssuesFeatureTile
          className="md:col-span-2 lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:min-h-[520px]"
          title={screens.title}
          description={screens.description}
          imageSrc={screens.image}
          imageAlt={screens.imageAlt}
          icon={screens.icon}
        />

        <CommonIssuesImageTile
          className="lg:col-span-3 lg:col-start-6 lg:row-start-1"
          title={battery.title}
          imageSrc={battery.image}
          imageAlt={battery.imageAlt}
        />

        <CommonIssuesStatTile
          className="lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1"
          stat="4"
          title="Core symptom groups"
          description={hardware.description}
          icon={hardware.icon}
          imageSrc={heroBackground}
          imageAlt=""
        />

        <CommonIssuesAccentTile
          className="lg:col-span-3 lg:col-start-6 lg:row-start-2"
          title={charging.title}
          description="Get structured preliminary estimates before approving any final repair quote."
          icon={charging.icon}
        />
      </div>
    </PageSection>
  )
}
