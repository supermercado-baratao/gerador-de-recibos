import { CssBaseline, ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { AppProvider, AuthProvider } from './providers'
import { Router } from './Router'
import { theme } from './theme'

const App = ({ queryClient }: { queryClient: QueryClient }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <Router />
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
)

export default App
