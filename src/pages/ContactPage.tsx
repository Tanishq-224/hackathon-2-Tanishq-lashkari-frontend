import { Container } from '@/components/shared/Container'

/**
 * @description Contact Us route placeholder until the functional form ships.
 * @returns {JSX.Element} Contact page shell.
 */
export function ContactPage() {
  return (
    <main className="flex-1 py-12 sm:py-16">
      <Container>
        <h1 className="text-h1 font-bold text-graphite">Contact us</h1>
        <p className="mt-4 max-w-2xl text-body text-slate-grey">
          Contact hero, verified details, and a backend-connected form arrive in
          Phase 1. This route confirms navigation and layout wiring.
        </p>
      </Container>
    </main>
  )
}
