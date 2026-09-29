import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  type QueryConstraint,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc
} from 'firebase/firestore'

import type { TCreateData, TUpdateData } from '@/types'

import { firestore } from './firebase-config'

const findUniqueById = async <T>({
  id,
  path
}: {
  id: string
  path: string
}): Promise<T | null> => {
  const docRef = doc(firestore, path, id)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? { ...(docSnap.data() as T), id } : null
}

const findMany = async <T>({
  path,
  queryConstraints
}: {
  path: string
  queryConstraints?: QueryConstraint[]
}): Promise<T[]> => {
  const q = query(collection(firestore, path), ...(queryConstraints ?? []))
  const { docs } = await getDocs(q)
  const data = docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }))
  return data as T[]
}

const writeTimestamps = () => ({
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
})

const create = async <T>({
  data,
  path
}: {
  data: TCreateData<T>
  path: string
}): Promise<T> => {
  const docRef = doc(collection(firestore, path))
  const now = Timestamp.now()
  await setDoc(docRef, { ...data, id: docRef.id, ...writeTimestamps() })
  return { ...data, id: docRef.id, createdAt: now, updatedAt: now } as T
}

const createWithId = async <T>({
  data,
  path
}: {
  data: TCreateData<T> & { id: string }
  path: string
}): Promise<T> => {
  const now = Timestamp.now()
  await setDoc(doc(firestore, path, data.id), { ...data, ...writeTimestamps() })
  return { ...data, createdAt: now, updatedAt: now } as T
}

const update = async <T>({
  data,
  path
}: {
  data: TUpdateData<T>
  path: string
}): Promise<T> => {
  if (Array.isArray(data)) {
    throw new Error('Data must be an object')
  }
  const now = Timestamp.now()
  await updateDoc(doc(firestore, path, data.id), {
    ...data,
    updatedAt: serverTimestamp()
  })
  return { ...data, updatedAt: now } as T
}

const deleteUniqueById = async ({
  id,
  path
}: {
  id: string
  path: string
}): Promise<string> => {
  await deleteDoc(doc(firestore, path, id))
  return id
}

export const database = {
  findUniqueById,
  findMany,
  create,
  createWithId,
  update,
  deleteUniqueById
}
