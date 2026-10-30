import { Link } from 'react-router-dom'

import notFoundBackground from '@/assets/not-found-background.jpg'

import './not-found-page.css'

/**
 * @description Full-viewport 404 with wallpaper background and public chrome.
 * @returns {JSX.Element}
 */
export function NotFoundPage() {
  return (
    <main
      className="not-found-page"
      role="main"
      aria-labelledby="not-found-title"
    >
      <div className="not-found-page__media" aria-hidden>
        <img
          className="not-found-page__image"
          src={notFoundBackground}
          alt=""
          fetchPriority="high"
          decoding="async"
        />
      </div>

      <div className="not-found-page__content">
        <div className="not-found-page__hero">
          <h1 id="not-found-title" className="not-found-page__headline">
            <span className="not-found-page__code">404</span>
            <span className="not-found-page__title">Page Not Found!</span>
          </h1>
        </div>

        <p className="not-found-page__lede">
          The link may be broken or the page may have moved. Head back home or
          reach out if you need help.
        </p>

        <div className="not-found-page__actions">
          <Link to="/" className="not-found-page__cta not-found-page__cta--primary">
            Back to home
          </Link>
          <Link to="/contact" className="not-found-page__cta not-found-page__cta--ghost">
            Contact us
          </Link>
        </div>
      </div>
    </main>
  )
}
