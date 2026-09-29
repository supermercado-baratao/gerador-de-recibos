import { Timestamp } from 'firebase/firestore'

export type TEmployee = {
  id: string
  name: string
  rg: string
  cpf: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
