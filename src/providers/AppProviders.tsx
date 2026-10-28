import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

import { createQueryClient } from '@/lib/query-client'

type AppProvidersProps = {
  children: ReactNode
}

const queryClient = createQueryClient()

/**
 * @description Wraps the app with shared client-side providers (TanStack Query, etc.).
 * @param {AppProvidersProps} props - Child tree to render inside providers.
 * @returns {JSX.Element} Provider stack.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
