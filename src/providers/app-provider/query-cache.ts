import type { QueryClient, QueryKey } from '@tanstack/react-query'

type TEntity = { id: string }

export const upsertInArrayCache = <T extends TEntity>(
  queryClient: QueryClient,
  key: QueryKey,
  item: T
) => {
  if (queryClient.getQueryData(key) === undefined) return
  queryClient.setQueryData<T[]>(key, (old = []) => {
    const exists = old.some((o) => o.id === item.id)
    return exists
      ? old.map((o) => (o.id === item.id ? item : o))
      : [...old, item]
  })
}

export const removeFromArrayCache = (
  queryClient: QueryClient,
  key: QueryKey,
  id: string
) => {
  if (queryClient.getQueryData(key) === undefined) return
  queryClient.setQueryData<TEntity[]>(key, (old = []) =>
    old.filter((o) => o.id !== id)
  )
}
