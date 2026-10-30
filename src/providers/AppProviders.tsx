import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

import { RealtimeSync } from '@/components/shared/RealtimeSync'
import { AppToastProvider } from '@/components/shared/AppToastProvider'
import { createQueryClient } from '@/lib/query-client'
import { ThemeProvider } from '@/providers/ThemeProvider'

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
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AppToastProvider>
          <RealtimeSync />
          {children}
        </AppToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
