import { QueryClient } from '@tanstack/react-query'
import { render, type RenderResult } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

import App from '@/App'

export const renderApp = (initialPath: string): RenderResult => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
      mutations: { retry: false }
    }
  })

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App queryClient={queryClient} />
    </MemoryRouter>
  )
}
