import { Link } from 'react-router-dom'
import { Store, UserRound } from 'lucide-react'

import { PageSection } from '@/components/shared/PageSection'
import { ScrollFadeIn } from '@/components/shared/ScrollFadeIn'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

/**
 * @description Dual-audience value proposition for customers and vendors.
 * @returns {JSX.Element} Customers and vendors section.
 */
export function AudienceSection() {
  return (
    <PageSection tone="canvas" ariaLabel="For customers and vendors">
      <SectionHeader
        eyebrow="Two sides, one workflow"
        title="For customers and vendors"
        description="Customers get visibility and control. Vendors get qualified requests and a structured path from estimate to approved repair."
      />
      <ScrollFadeIn
        className="mt-10 grid gap-6 lg:grid-cols-2"
        delay={0.12}
        stagger={0.11}
      >
        <Card className="h-full">
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserRound aria-hidden className="size-5" />
            </div>
            <CardTitle className="font-display text-h3">Customers</CardTitle>
            <CardDescription>
              Submit repair requests, upload device photos, compare estimates,
              approve final quotes, and track progress in one place.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-body text-muted-foreground">
              <li>Verified account and role-protected dashboard access</li>
              <li>Side-by-side preliminary estimates</li>
              <li>Clear approval step before repair begins</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link to="/contact" className={buttonVariants({ size: 'lg' })}>
              Get started as a customer
            </Link>
          </CardFooter>
        </Card>
        <Card className="h-full">
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Store aria-hidden className="size-5" />
            </div>
            <CardTitle className="font-display text-h3">Vendors</CardTitle>
            <CardDescription>
              Review eligible requests, submit estimates, share diagnosis
              reports, and update repair status after customer approval.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-body text-muted-foreground">
              <li>Structured request and quotation workflow</li>
              <li>Customer approval before final work proceeds</li>
              <li>Status updates customers can follow in real time</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link
              to="/contact"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              Partner with Repairex
            </Link>
          </CardFooter>
        </Card>
      </ScrollFadeIn>
    </PageSection>
  )
}
