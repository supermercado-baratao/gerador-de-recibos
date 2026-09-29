import { useQueries } from '@tanstack/react-query'
import { useEffect } from 'react'

import { companyModel, employeeModel, receiptModel } from '@/models'
import { useAlertStore, useAuthStore } from '@/stores'

export const useDataFetch = () => {
  const { alert } = useAlertStore()
  const isEnabled = useAuthStore((state) => !!state.user?.emailVerified)

  const queries = useQueries({
    queries: [
      {
        queryKey: ['company'],
        queryFn: companyModel.find,
        enabled: isEnabled
      },
      {
        queryKey: ['employees'],
        queryFn: employeeModel.findMany,
        enabled: isEnabled
      },
      {
        queryKey: ['receipts'],
        queryFn: receiptModel.findMany,
        enabled: isEnabled
      }
    ]
  })

  const [{ data: company }, { data: employees }, { data: receipts }] = queries

  const isFetched = queries.every((query) => query.isFetched)
  const isError = queries.some((query) => query.isError)

  useEffect(() => {
    if (isError) {
      alert({
        severity: 'error',
        title: 'Erro ao buscar dados',
        description: 'Atualize a página ou tente novamente mais tarde'
      })
    }
  }, [isError, alert])

  return { company, employees, receipts, isFetched }
}
