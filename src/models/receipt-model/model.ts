import { database, getUserPath } from '@/infra'
import type { TCreateData } from '@/types'

import type { TReceipt } from './types'

const PATH = 'receipts'

const create = (data: TCreateData<TReceipt>): Promise<TReceipt> =>
  database.create({ path: getUserPath(PATH), data })

const findMany = (): Promise<TReceipt[]> =>
  database.findMany<TReceipt>({ path: getUserPath(PATH) })

const deleteUniqueById = (id: string): Promise<string> =>
  database.deleteUniqueById({ path: getUserPath(PATH), id })

export const receiptModel = { create, findMany, deleteUniqueById }
