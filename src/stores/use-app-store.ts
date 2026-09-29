import { create } from 'zustand'

import type { TCompany, TEmployee, TReceipt } from '@/models'
import type { TCreateData, TUpdateData } from '@/types'

type TAppData = {
  company: TCompany | null
  employees: TEmployee[]
  receipts: TReceipt[]
}

type TAppStore = TAppData & {
  isFetched: boolean
  setData: (data: TAppData) => void
  reset: () => void

  updateCompany: (
    company: TCreateData<TCompany>,
    options?: { onSuccess?: (company: TCompany) => void }
  ) => void

  createEmployee: (
    employee: TCreateData<TEmployee>,
    options?: { onSuccess?: (employee: TEmployee) => void }
  ) => void
  updateEmployee: (employee: TUpdateData<TEmployee>) => void
  deleteEmployee: (id: string) => void

  createReceipt: (receipt: TCreateData<TReceipt>) => void

  employeeId: string | null
  setEmployeeId: (id: string | null) => void
}

const initialState = {
  company: null,
  employees: [],
  receipts: [],
  isFetched: false,
  employeeId: null
}

export const useAppStore = create<TAppStore>((set) => ({
  ...initialState,
  setData: (data) => set({ ...data, isFetched: true }),
  reset: () => set(initialState),

  updateCompany: () => {},

  createEmployee: () => {},
  updateEmployee: () => {},
  deleteEmployee: () => {},

  createReceipt: () => {},

  setEmployeeId: (id) => set({ employeeId: id })
}))
