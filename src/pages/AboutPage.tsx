import { Container } from '@/components/shared/Container'

/**
 * @description About Us route placeholder for Phase 1 content sections.
 * @returns {JSX.Element} About page shell.
 */
export function AboutPage() {
  return (
    <main className="flex-1 py-12 sm:py-16">
      <Container>
        <h1 className="text-h1 font-bold text-graphite">About Repairex</h1>
        <p className="mt-4 max-w-2xl text-body text-slate-grey">
          Full About Us sections will be implemented in Phase 1. Routing and
          shared public layout are wired in Phase 0.
        </p>
      </Container>
    </main>
  )
}
