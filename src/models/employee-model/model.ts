import { database, getUserPath } from '@/infra'
import type { TCreateData, TUpdateData } from '@/types'

import type { TEmployee } from './types'

const PATH = 'employees'

const create = (data: TCreateData<TEmployee>): Promise<TEmployee> =>
  database.create({ path: getUserPath(PATH), data })

const findMany = (): Promise<TEmployee[]> =>
  database.findMany<TEmployee>({ path: getUserPath(PATH) })

const update = (data: TUpdateData<TEmployee>): Promise<TEmployee> =>
  database.update({ path: getUserPath(PATH), data })

const deleteUniqueById = (id: string): Promise<string> =>
  database.deleteUniqueById({ path: getUserPath(PATH), id })

export const employeeModel = { create, findMany, update, deleteUniqueById }
