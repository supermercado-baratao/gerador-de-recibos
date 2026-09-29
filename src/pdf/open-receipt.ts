import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { TDocumentDefinitions } from 'pdfmake/interfaces'

import type { TReceipt, TReceiptType } from '@/models'
import type { TCreateData } from '@/types'

import { TDocHeader } from './partials'
import { proportionalThirteenthPdf } from './proportional-thirteenth'
import { proportionalVacationPdf } from './proportional-vacation'
import { salaryPdf } from './salary'
import { thirteenthSalaryPdf } from './thirteenth-salary.ts'
import { vacationPdf } from './vacation'

pdfMake.addVirtualFileSystem(pdfFonts)

const builders: Record<
  TReceiptType,
  (args: { header: TDocHeader; main: never }) => TDocumentDefinitions
> = {
  salary: salaryPdf,
  vacation: vacationPdf,
  'proportional-vacation': proportionalVacationPdf,
  'thirteenth-salary': thirteenthSalaryPdf,
  'proportional-thirteenth': proportionalThirteenthPdf
}

export const openReceiptPdf = ({
  type,
  title,
  company,
  employee,
  data
}: TCreateData<TReceipt>) => {
  const pdf = builders[type]({
    header: { title, company, employee },
    main: data as never
  })
  return pdfMake.createPdf(pdf).open()
}
