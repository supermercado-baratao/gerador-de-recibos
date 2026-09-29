import { database, getUserPath } from '@/infra'
import type { TCreateData } from '@/types'

import type { TReceipt } from './types'

const PATH = 'receipts'

const create = (data: TCreateData<TReceipt>): Promise<TReceipt> =>
  database.create({ path: getUserPath(PATH), data })

const findMany = (): Promise<TReceipt[]> =>
  database.findMany<TReceipt>({ path: getUserPath(PATH) })

export const receiptModel = { create, findMany }
