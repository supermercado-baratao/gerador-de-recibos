import { create } from 'zustand'

type TParams = {
  title: string
  description?: string
  severity?: 'success' | 'error' | 'warning' | 'info'
  autoHideDuration?: number
}

type TUseAlertStore = {
  params: TParams | null
  alert: (params: TParams) => void
  clear: () => void
}

export const useAlertStore = create<TUseAlertStore>((set) => ({
  params: null,
  alert: (params) => set({ params }),
  clear: () => set({ params: null })
}))
