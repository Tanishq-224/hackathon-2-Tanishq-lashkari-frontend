import { Link } from 'react-router-dom'

import notFoundBackground from '@/assets/not-found-background.jpg'

import './not-found-page.css'

/**
 * @description Branded 404 with reference layout, glass UI, and public chrome.
 * @returns {JSX.Element}
 */
export function NotFoundPage() {
  return (
    <main
      className="not-found-page"
      role="main"
      aria-labelledby="not-found-title"
    >
      <div className="not-found-page__backdrop" aria-hidden>
        <img
          className="not-found-page__backdrop-image"
          src={notFoundBackground}
          alt=""
          fetchPriority="high"
        />
        <div className="not-found-page__vignette" />
      </div>

      <div className="not-found-page__inner">
        <Link to="/" className="not-found-page__badge not-found-glass">
          <span className="not-found-page__badge-mark" aria-hidden>
            R
          </span>
          Repairex
        </Link>

        <div className="not-found-page__glass-panel not-found-glass">
          <div className="not-found-page__hero">
            <p className="not-found-page__code" aria-hidden>
              404
            </p>
            <h1 id="not-found-title" className="not-found-page__title">
              Page Not Found!
            </h1>
          </div>

          <div className="not-found-page__cta-wrap">
            <Link to="/" className="not-found-page__cta">
              Back home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
