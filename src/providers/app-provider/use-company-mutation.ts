import { useMutation, useQueryClient } from '@tanstack/react-query'

import { companyModel } from '@/models'
import { useAlertStore, useCallbackStore } from '@/stores'

const QUERY_KEY = ['company']

export const useCompanyMutation = () => {
  const { alert } = useAlertStore()
  const { handleSuccessCallbacks, handleErrorCallbacks } = useCallbackStore()

  const queryClient = useQueryClient()

  const { mutate: updateCompany } = useMutation({
    mutationFn: companyModel.upsert,
    onSuccess: (company) => {
      queryClient.setQueryData(QUERY_KEY, company)
      alert({ severity: 'success', title: 'Empresa salva com sucesso!' })
      handleSuccessCallbacks()
    },
    onError: () => {
      alert({ severity: 'error', title: 'Erro ao salvar empresa' })
      handleErrorCallbacks()
    }
  })

  return { updateCompany }
}
