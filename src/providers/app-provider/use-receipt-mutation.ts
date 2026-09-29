import { useMutation, useQueryClient } from '@tanstack/react-query'

import { receiptModel } from '@/models'
import { useAlertStore } from '@/stores'

import { upsertInArrayCache } from './query-cache'

const QUERY_KEY = ['receipts']

export const useReceiptMutation = () => {
  const { alert } = useAlertStore()

  const queryClient = useQueryClient()

  const { mutate: createReceipt } = useMutation({
    mutationFn: receiptModel.create,
    onSuccess: (receipt) => {
      upsertInArrayCache(queryClient, QUERY_KEY, receipt)
      alert({ severity: 'success', title: 'Recibo salvo com sucesso!' })
    },
    onError: () => {
      alert({ severity: 'error', title: 'Erro ao salvar recibo' })
    }
  })

  return { createReceipt }
}
