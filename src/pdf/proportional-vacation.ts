import { TDocumentDefinitions } from 'pdfmake/interfaces'

import { TProportionalVacationReceipt } from '@/types'
import { formatCurrency, formatDate, formatToExtensive } from '@/utils'

import { docFooter, docHeader, docStyles, TDocHeader } from './partials'

export type TProportionalVacationPDF = {
  header: TDocHeader
  main: TProportionalVacationReceipt
}

export const proportionalVacationPdf = (
  args: TProportionalVacationPDF
): TDocumentDefinitions => {
  const {
    header,
    main: {
      salary,
      proportionalOneThird,
      proportionalNetValue,
      proportionalValue = proportionalNetValue - proportionalOneThird,
      date,
      endDate,
      period
    }
  } = args
  return {
    content: [
      ...docHeader(header),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              {
                text: [
                  {
                    text: 'Salário: ',
                    style: 'label'
                  },
                  formatCurrency(salary)
                ],
                border: [true, false, true, true]
              },
              {
                text: [
                  {
                    text: 'Valor Proporcional ao Período: ',
                    style: 'label'
                  },
                  formatCurrency(proportionalValue)
                ],
                border: [true, false, true, true]
              }
            ]
          ]
        }
      },
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              {
                text: [
                  {
                    text: 'Terço de Férias Proporcional: ',
                    style: 'label'
                  },
                  formatCurrency(proportionalOneThird)
                ],
                border: [true, false, true, true]
              },
              {
                text: [
                  {
                    text: 'Valor Líquido: ',
                    style: 'label'
                  },
                  formatCurrency(proportionalNetValue)
                ],
                border: [true, false, true, true]
              }
            ]
          ]
        }
      },
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: [
                  {
                    text: 'Período: ',
                    style: 'label'
                  },
                  `${formatDate(date)} à ${formatDate(endDate)}`
                ],
                border: [true, false, true, true]
              }
            ]
          ]
        }
      },
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: `Declaro que recebi a quantia líquida de ${formatCurrency(proportionalNetValue)} - ${formatToExtensive(proportionalNetValue)}, referente ao pagamento das minhas férias, proporcionais a ${period}.`,
                margin: [10, 10, 10, 2],
                border: [true, false, true, false]
              }
            ],
            [
              {
                text: 'Para clareza e documento, firmo o presente recibo, dando plena e geral quitação.',
                margin: [10, 0, 10, 10],
                border: [true, false, true, false]
              }
            ]
          ]
        }
      },
      ...docFooter(header.employee.name)
    ],
    styles: docStyles
  }
}
