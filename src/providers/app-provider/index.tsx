import { Alert, Loader } from '@/components'

import { useAppHandler } from './use-app-handler'

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAppHandler()

  return (
    <>
      {children}
      <Loader open={isLoading} />
      <Alert />
    </>
  )
}
