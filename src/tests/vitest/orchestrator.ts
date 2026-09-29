import type { TCompany, TEmployee, TReceipt } from '@/models'
import type { TCreateData } from '@/types'

import { seedCollection } from './_mocks/database'
import { registerAccount, setAuthMockUser } from './_mocks/firebase-auth'

export const PASSWORD = 'senha123'

export const companyData: TCreateData<TCompany> = {
  name: 'Mercado Bom Preço',
  cnpj: '11.222.333/0001-81',
  tel: '(71) 3333-4444',
  street: 'Rua das Flores',
  num: '10',
  district: 'Centro',
  uf: 'BA',
  city: 'Salvador'
}

export const employeesData: (TCreateData<TEmployee> & { id: string })[] = [
  {
    id: 'employee-maria',
    name: 'Maria da Silva',
    rg: '12.345.678-90',
    cpf: '529.982.247-25'
  },
  {
    id: 'employee-joao',
    name: 'João Souza',
    rg: '98.765.432-10',
    cpf: '111.444.777-35'
  }
]

export const createUser = ({
  email = 'dono@mercado.com',
  emailVerified = true
}: { email?: string; emailVerified?: boolean } = {}) => {
  const user = registerAccount({ email, password: PASSWORD, emailVerified })
  setAuthMockUser(user)
  return user
}

export const makeSalaryReceipt = (
  employee: (typeof employeesData)[number],
  { id, salary, date }: { id: string; salary: number; date: string }
): TCreateData<TReceipt> & { id: string } => {
  const { id: employeeId, ...employeeSnapshot } = employee
  return {
    id,
    employeeId,
    type: 'salary',
    title: 'Recibo de Salário',
    company: companyData,
    employee: employeeSnapshot,
    data: { salary, date }
  }
}

export const populateDatabase = ({
  withEmployees = true
}: { withEmployees?: boolean } = {}) => {
  seedCollection('companies', [{ id: 'main', ...companyData }])
  if (withEmployees) seedCollection('employees', employeesData)
}
