import { Content } from 'pdfmake/interfaces'

import type { TCompany, TEmployee } from '@/models'
import type { TCreateData } from '@/types'

export type TDocHeader = {
  title: string
  company: TCreateData<TCompany>
  employee: TCreateData<TEmployee>
}

export const docHeader = (data: TDocHeader): Content[] => [
  {
    table: {
      widths: ['*'],
      body: [
        [
          {
            text: data.title,
            style: 'header'
          }
        ]
      ]
    }
  },
  {
    table: {
      widths: ['*', 150],
      body: [
        [
          {
            text: [
              {
                text: 'Empregador: ',
                style: 'label'
              },
              data.company.name
            ],
            border: [true, false, true, true]
          },
          {
            text: [
              {
                text: 'CNPJ: ',
                style: 'label'
              },
              data.company.cnpj
            ],
            border: [true, false, true, true]
          }
        ]
      ]
    }
  },
  {
    table: {
      widths: ['*', 150],
      body: [
        [
          {
            text: [
              {
                text: 'Endereço: ',
                style: 'label'
              },
              `${data.company.street} - Nº ${data.company.num} - ${data.company.district} - ${data.company.city}-${data.company.uf}`
            ],
            border: [true, false, true, true]
          },
          {
            text: [
              {
                text: 'Telefone: ',
                style: 'label'
              },
              data.company.tel
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
                text: 'Empregado: ',
                style: 'label'
              },
              data.employee.name
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
                text: 'CPF: ',
                style: 'label'
              },
              data.employee.cpf
            ],
            border: [true, false, true, true]
          },
          {
            text: [
              {
                text: 'RG: ',
                style: 'label'
              },
              data.employee.rg
            ],
            border: [true, false, true, true]
          }
        ]
      ]
    }
  }
]
