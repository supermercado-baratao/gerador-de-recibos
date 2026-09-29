import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { useEffect } from 'react'

import { useAppStore } from '@/stores'

import { useCompanyMutation } from './use-company-mutation'
import { useDataFetch } from './use-data-fetch'
import { useEmployeeMutation } from './use-employee-mutation'
import { useReceiptMutation } from './use-receipt-mutation'

export const useAppHandler = () => {
  const setData = useAppStore((state) => state.setData)

  const { company, employees, receipts, isFetched } = useDataFetch()
  const { updateCompany } = useCompanyMutation()
  const { createEmployee, updateEmployee, deleteEmployee } =
    useEmployeeMutation()
  const { createReceipt } = useReceiptMutation()

  const isFetching = useIsFetching({
    predicate: ({ queryKey }) => queryKey[0] !== 'getSalaries'
  })
  const isMutating = useIsMutating()
  const isLoading = Boolean(isFetching || isMutating)

  useEffect(() => {
    if (!isFetched) return
    setData({
      company: company ?? null,
      employees: employees ?? [],
      receipts: receipts ?? []
    })
  }, [isFetched, company, employees, receipts, setData])

  useEffect(() => {
    useAppStore.setState({
      updateCompany,
      createEmployee,
      updateEmployee,
      deleteEmployee,
      createReceipt
    })
  }, [
    updateCompany,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    createReceipt
  ])

  return { isLoading }
}
