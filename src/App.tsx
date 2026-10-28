import { RouterProvider } from 'react-router-dom'

import { AppProviders } from '@/providers/AppProviders'
import { createAppRouter } from '@/routes/router'

const router = createAppRouter()

/**
 * @description Root component wiring providers and client-side routing.
 * @returns {JSX.Element} Repairex application shell.
 */
function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}

export default App
