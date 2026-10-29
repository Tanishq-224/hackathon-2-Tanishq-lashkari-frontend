import { ArrowRight, Laptop, Smartphone, Tablet, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { PageSection } from '@/components/shared/PageSection'
import { ScrollFadeIn } from '@/components/shared/ScrollFadeIn'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type DeviceCategory = {
  key: string
  titleLineOne: string
  titleLineTwo: string
  description: string
  icon: LucideIcon
}

const categories: DeviceCategory[] = [
  {
    key: 'phones',
    titleLineOne: 'Phone repairs',
    titleLineTwo: 'Modern smartphones',
    description:
      'Screen replacements, battery health, charging ports, and board-level faults for supported phone models.',
    icon: Smartphone,
  },
  {
    key: 'laptops',
    titleLineOne: 'Laptop repairs',
    titleLineTwo: 'Portable computers',
    description:
      'Keyboard, display, power, storage, and performance issues for everyday laptops and ultrabooks.',
    icon: Laptop,
  },
  {
    key: 'tablets',
    titleLineOne: 'Tablet repairs',
    titleLineTwo: 'Touchscreen devices',
    description:
      'Touchscreen calibration, battery swaps, and connectivity fixes for supported tablet devices.',
    icon: Tablet,
  },
]

type DeviceCategoryCardProps = {
  category: DeviceCategory
}

/**
 * @description Editorial bordered card for a supported device category.
 * @param {DeviceCategoryCardProps} props - Category content and icon.
 * @returns {JSX.Element} Device category card.
 */
function DeviceCategoryCard({ category }: DeviceCategoryCardProps) {
  const Icon = category.icon

  return (
    <article className="theme-editorial-card flex h-full min-h-[18rem] flex-col p-6 sm:min-h-[20rem] sm:p-8 lg:p-10">
      <div className="theme-icon-chip size-14 shrink-0">
        <Icon aria-hidden className="size-7" strokeWidth={1.75} />
      </div>
      <h3 className="mt-8 font-display text-h2 font-semibold leading-tight text-foreground">
        {category.titleLineOne}
        <span className="mt-1 block text-h3 font-medium text-muted-foreground">
          {category.titleLineTwo}
        </span>
      </h3>
      <p className="mt-5 max-w-sm text-body leading-relaxed text-muted-foreground">
        {category.description}
      </p>
    </article>
  )
}

/**
 * @description Supported device categories in an editorial three-card layout.
 * @returns {JSX.Element} Device categories section.
 */
export function DeviceCategoriesSection() {
  return (
    <PageSection
      tone="canvas"
      ariaLabel="Supported device categories"
      containerClassName="max-w-[88rem]"
    >
      <SectionHeader
        eyebrow="Devices we support"
        title="Repairs for the devices you rely on"
        description="Repairex focuses on common consumer electronics. Request help only for supported categories so vendors can respond accurately."
      />

      <ScrollFadeIn
        as="ul"
        className="theme-card-grid mt-10 grid grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0"
        delay={0.12}
        stagger={0.1}
      >
        {categories.map((category) => (
          <li key={category.key} className="min-h-full">
            <DeviceCategoryCard category={category} />
          </li>
        ))}
      </ScrollFadeIn>

      <div className="mt-10">
        <Link
          to="/contact"
          className={cn(
            buttonVariants({ size: 'lg' }),
            'h-12 rounded-full bg-foreground px-7 text-background hover:bg-foreground/90',
          )}
        >
          Start a repair request
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
    </PageSection>
  )
}
