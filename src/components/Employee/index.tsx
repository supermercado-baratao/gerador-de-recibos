import { useAppStore } from '@/stores'

import { Form } from './Form'

type TEmployeeProps = {
  setStep: (step: number) => void
}

export const Employee = ({ setStep }: TEmployeeProps) => {
  const employees = useAppStore((state) => state.employees)
  const employeeId = useAppStore((state) => state.employeeId)

  const employee = employees.find(({ id }) => id === employeeId) ?? null

  return (
    <Form key={employee?.id ?? 'new'} employee={employee} setStep={setStep} />
  )
}
