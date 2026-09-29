import { database, getUserPath } from '@/infra'
import type { TCreateData } from '@/types'

import type { TCompany } from './types'

const PATH = 'companies'
const COMPANY_ID = 'main'

const find = (): Promise<TCompany | null> =>
  database.findUniqueById<TCompany>({
    id: COMPANY_ID,
    path: getUserPath(PATH)
  })

const create = (data: TCreateData<TCompany>): Promise<TCompany> =>
  database.createWithId<TCompany>({
    path: getUserPath(PATH),
    data: { id: COMPANY_ID, ...data }
  })

const upsert = async (data: TCreateData<TCompany>): Promise<TCompany> => {
  const existing = await find()

  if (existing) {
    return database.update<TCompany>({
      path: getUserPath(PATH),
      data: { ...existing, ...data }
    })
  }

  return create(data)
}

export const companyModel = {
  find,
  create,
  upsert
}
