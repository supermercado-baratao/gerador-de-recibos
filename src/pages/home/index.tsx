import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Employee, Receipt } from '@/components'
import { getSalaries } from '@/services'

export const Home = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['getSalaries'],
    queryFn: getSalaries
  })

  const [step, setStep] = useState(0)

  if (step === 0) return <Employee setStep={setStep} />

  return (
    <Receipt
      salaries={data}
      isLoading={isLoading}
      isError={isError}
      setStep={setStep}
    />
  )
}
