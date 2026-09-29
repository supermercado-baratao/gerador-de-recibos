import { Timestamp } from 'firebase/firestore'
import { vi } from 'vitest'

import { getMockCurrentUserUid } from './firebase-auth'

type TDoc = { id: string } & Record<string, unknown>

const getUserPath = (collection: string) =>
  `users/${getMockCurrentUserUid()}/${collection}`

const now = () => Timestamp.now()

const hoisted = vi.hoisted(() => ({
  store: new Map<string, Map<string, TDoc>>(),
  databaseMock: Object.fromEntries(
    [
      'findUniqueById',
      'findMany',
      'create',
      'createWithId',
      'update',
      'deleteUniqueById'
    ].map((key) => [key, vi.fn()])
  )
}))

const collectionOf = (path: string) => {
  if (!hoisted.store.has(path)) hoisted.store.set(path, new Map())
  return hoisted.store.get(path)!
}

export const seedCollection = (collection: string, docs: object[]) => {
  const map = collectionOf(getUserPath(collection))
  docs.forEach((doc) =>
    map.set((doc as TDoc).id, {
      createdAt: now(),
      updatedAt: now(),
      ...doc
    } as unknown as TDoc)
  )
}

export const getSeededCollection = (collection: string): TDoc[] =>
  Array.from(collectionOf(getUserPath(collection)).values()).map((doc) => ({
    ...doc
  }))

const defaultImpls = {
  findUniqueById: ({ id, path }: { id: string; path: string }) =>
    Promise.resolve(collectionOf(path).get(id) ?? null),
  findMany: ({ path }: { path: string }) =>
    Promise.resolve(Array.from(collectionOf(path).values())),
  create: ({ data, path }: { data: object; path: string }) => {
    const doc = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now(),
      updatedAt: now()
    } as TDoc
    collectionOf(path).set(doc.id, doc)
    return Promise.resolve(doc)
  },
  createWithId: ({ data, path }: { data: { id: string }; path: string }) => {
    const doc = { ...data, createdAt: now(), updatedAt: now() } as TDoc
    collectionOf(path).set(doc.id, doc)
    return Promise.resolve(doc)
  },
  update: ({ data, path }: { data: { id: string }; path: string }) => {
    const map = collectionOf(path)
    const doc = { ...map.get(data.id), ...data, updatedAt: now() } as TDoc
    map.set(doc.id, doc)
    return Promise.resolve(doc)
  },
  deleteUniqueById: ({ id, path }: { id: string; path: string }) => {
    collectionOf(path).delete(id)
    return Promise.resolve(id)
  }
} as const

type TDatabaseMockKey = keyof typeof defaultImpls

export const databaseMock = hoisted.databaseMock as {
  [K in TDatabaseMockKey]: ReturnType<typeof vi.fn>
}

export const resetDatabaseMock = () => {
  hoisted.store.clear()
  ;(Object.keys(defaultImpls) as TDatabaseMockKey[]).forEach((key) => {
    databaseMock[key].mockReset()
    databaseMock[key].mockImplementation(defaultImpls[key] as never)
  })
}

vi.mock('@/infra/database', () => ({ database: hoisted.databaseMock }))
