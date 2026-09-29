import type { TReceipt } from '@/models'
import type {
  TProportionalThirteenthReceipt,
  TSalaryOrTThirteenthReceipt,
  TVacationReceipt
} from '@/types'

export const getReceiptAmount = ({ type, data }: TReceipt) => {
  switch (type) {
    case 'salary':
    case 'thirteenth-salary':
      return (data as TSalaryOrTThirteenthReceipt).salary
    case 'vacation':
      return (data as TVacationReceipt).netValue
    case 'proportional-vacation':
    case 'proportional-thirteenth':
      return (data as TProportionalThirteenthReceipt).proportionalNetValue
  }
}

export const sortByNewest = (receipts: TReceipt[]) =>
  [...receipts].sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
