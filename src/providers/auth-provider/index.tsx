import { useQueryClient } from '@tanstack/react-query'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useRef, useState } from 'react'

import { Loader } from '@/components'
import { auth } from '@/infra'
import { useAppStore, useAuthStore } from '@/stores'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser } = useAuthStore()
  const queryClient = useQueryClient()

  const [isInitialized, setIsInitialized] = useState(false)
  const previousUidRef = useRef<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const uid = firebaseUser?.uid ?? null
      if (previousUidRef.current !== null && previousUidRef.current !== uid) {
        queryClient.clear()
        useAppStore.getState().reset()
      }
      previousUidRef.current = uid
      setUser(firebaseUser)
      setIsInitialized(true)
    })

    return () => unsubscribe()
  }, [setUser, queryClient])

  if (!isInitialized) return <Loader open />

  return children
}
