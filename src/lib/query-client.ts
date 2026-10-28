import { QueryClient } from '@tanstack/react-query'

/**
 * @description Default TanStack Query client for server state across the app.
 * @returns {QueryClient} Configured query client instance.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: 1,
        refetchOnWindowFocus:
          typeof import.meta !== 'undefined' && import.meta.env?.PROD === true,
      },
    },
  })
}
