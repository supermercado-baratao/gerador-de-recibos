import { Timestamp } from 'firebase/firestore'

import type {
  TCreateData,
  TProportionalThirteenthReceipt,
  TProportionalVacationReceipt,
  TSalaryOrTThirteenthReceipt,
  TVacationReceipt
} from '@/types'

import type { TCompany } from '../company-model'
import type { TEmployee } from '../employee-model'

export type TReceiptType =
  | 'salary'
  | 'vacation'
  | 'proportional-vacation'
  | 'thirteenth-salary'
  | 'proportional-thirteenth'

export type TReceiptData =
  | TSalaryOrTThirteenthReceipt
  | TVacationReceipt
  | TProportionalVacationReceipt
  | TProportionalThirteenthReceipt

export type TReceipt = {
  id: string
  employeeId: string
  type: TReceiptType
  title: string
  company: TCreateData<TCompany>
  employee: TCreateData<TEmployee>
  data: TReceiptData
  createdAt: Timestamp
  updatedAt: Timestamp
}
