import { Link } from 'react-router-dom'

import { Container } from '@/components/shared/Container'

/**
 * @description Shared footer for public pages with core navigation links.
 * @returns {JSX.Element} Public site footer.
 */
export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-warm-stone bg-off-white py-8">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-caption text-slate-grey">
          © {new Date().getFullYear()} Repairex. Electronics repair marketplace.
        </p>
        <div className="flex gap-4 text-ui">
          <Link to="/about" className="text-slate-grey hover:text-graphite">
            About
          </Link>
          <Link to="/contact" className="text-slate-grey hover:text-graphite">
            Contact
          </Link>
        </div>
      </Container>
    </footer>
  )
}
