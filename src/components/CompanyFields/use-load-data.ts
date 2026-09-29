import { useQueries } from '@tanstack/react-query'

import { getCities, getUfs } from '@/services'
import { TUF } from '@/types'

const sortUfsByName = (ufs: TUF[]) =>
  [...ufs].sort((a, b) => a.name.localeCompare(b.name))

const sortCitiesByName = (cities: string[]) =>
  [...cities].sort((a, b) => a.localeCompare(b))

export const useLoadData = ({ acronym }: { acronym: string | undefined }) => {
  const queries = useQueries({
    queries: [
      {
        queryKey: ['getUfs'],
        queryFn: getUfs,
        select: sortUfsByName
      },
      {
        queryKey: ['getCities', acronym],
        queryFn: () => getCities(acronym!),
        select: sortCitiesByName,
        enabled: !!acronym
      }
    ]
  })

  const isError = queries.some(({ isError }) => isError)

  return {
    isError,
    ufs: queries[0].data,
    cities: queries[1].data
  }
}
