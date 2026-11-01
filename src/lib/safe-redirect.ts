/**
 * @description Allows only same-origin relative paths after login (blocks open redirects).
 * @param {string | null | undefined} path - Requested return path from query params.
 * @param {string} [fallback='/'] - Path when the value is missing or unsafe.
 * @returns {string} Safe in-app path.
 */
export function resolveSafeRedirectPath(
  path: string | null | undefined,
  fallback = '/',
): string {
  if (!path || !path.startsWith('/') || path.startsWith('//')) {
    return fallback
  }

  return path
}
