import { Timestamp } from 'firebase/firestore'

export type TCompany = {
  id: string
  name: string
  cnpj: string
  tel: string
  street: string
  num: string
  district: string
  uf: string
  city: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
