import {
  type QueryKey,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'

import { useAlertStore, useCallbackStore } from '@/stores'

import { removeFromArrayCache, upsertInArrayCache } from './query-cache'

type TEntity = { id: string }

type TEntityLabels = {
  created: string
  createError: string
  updated: string
  updateError: string
  deleted: string
  deleteError: string
}

export const useEntityMutation = <TItem extends TEntity, TCreate, TUpdate>({
  queryKey,
  create,
  update,
  deleteUniqueById,
  labels
}: {
  queryKey: QueryKey
  create: (data: TCreate) => Promise<TItem>
  update: (data: TUpdate) => Promise<TItem>
  deleteUniqueById: (id: string) => Promise<string>
  labels: TEntityLabels
}) => {
  const { alert } = useAlertStore()
  const { handleSuccessCallbacks, handleErrorCallbacks } = useCallbackStore()
  const queryClient = useQueryClient()

  const { mutate: createItem } = useMutation({
    mutationFn: create,
    onSuccess: (item) => {
      upsertInArrayCache(queryClient, queryKey, item)
      alert({ severity: 'success', title: labels.created })
      handleSuccessCallbacks()
    },
    onError: () => {
      alert({ severity: 'error', title: labels.createError })
      handleErrorCallbacks()
    }
  })

  const { mutate: updateItem } = useMutation({
    mutationFn: update,
    onSuccess: (item) => {
      upsertInArrayCache(queryClient, queryKey, item)
      alert({ severity: 'success', title: labels.updated })
      handleSuccessCallbacks()
    },
    onError: () => {
      alert({ severity: 'error', title: labels.updateError })
      handleErrorCallbacks()
    }
  })

  const { mutate: deleteItem } = useMutation({
    mutationFn: deleteUniqueById,
    onSuccess: (id) => {
      removeFromArrayCache(queryClient, queryKey, id)
      alert({ severity: 'success', title: labels.deleted })
      handleSuccessCallbacks()
    },
    onError: () => {
      alert({ severity: 'error', title: labels.deleteError })
      handleErrorCallbacks()
    }
  })

  return { createItem, updateItem, deleteItem }
}
