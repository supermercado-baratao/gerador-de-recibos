import type { User } from 'firebase/auth'
import { create } from 'zustand'

type TAuthStore = {
  user: User | null
  setUser: (user: User | null) => void
}

export const useAuthStore = create<TAuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user })
}))
