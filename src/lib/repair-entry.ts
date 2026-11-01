/** @description Customer flow entry for creating a new repair request. */
export const NEW_REPAIR_REQUEST_PATH = '/dashboard/new-repair'

/**
 * @description Auth-aware path for “Start a repair request” CTAs.
 * @param {boolean} isAuthenticated - Whether the visitor has an active session.
 * @returns {string} Dashboard new-repair or login with redirect.
 */
export function getStartRepairRequestPath(isAuthenticated: boolean): string {
  if (isAuthenticated) {
    return NEW_REPAIR_REQUEST_PATH
  }

  return `/login?redirect=${encodeURIComponent(NEW_REPAIR_REQUEST_PATH)}`
}
