import { useScrollToTopOnNavigate } from '@/hooks/useScrollToTopOnNavigate'

/**
 * @description Ensures new routes start at the page top (or hash target when provided).
 * @returns {null} Renderless navigation scroll helper.
 */
export function RouteScrollReset() {
  useScrollToTopOnNavigate()
  return null
}
