// TODO: os valores derivados (período, 1/3, valor líquido) são recalculados
// em cadeia por efeitos; mover esses cálculos para os handlers de mudança.
/* eslint-disable react-hooks/set-state-in-effect */
import { FormControl, InputLabel, SelectChangeEvent } from '@mui/material'
import { Dayjs } from 'dayjs'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { ValidationError } from 'yup'

import { Loader, Select, StepLayout } from '@/components'
import type { TReceiptData, TReceiptType } from '@/models'
import { openReceiptPdf } from '@/pdf'
import { useAlertStore, useAppStore } from '@/stores'
import { TSalary } from '@/types'
import { formatCurrencyToNumber, omitMetadata } from '@/utils'

import {
  currentDate,
  getEndDate,
  getNumberOfMonths,
  getPeriod,
  getYearMonth
} from './date'
import {
  ProportionalThirteenth,
  ProportionalVacation,
  SalaryOrThirteenth,
  Vacation
} from './Options'
import {
  getNetValue,
  getOneThird,
  getProportionalNetValue,
  getProportionalOneThird
} from './receipt'
import {
  proportionalThirteenthSchema,
  proportionalVacationSchema,
  salaryOrThirteenthSchema,
  vacationSchema
} from './schemas'
import { selectItems } from './select-items'

type TReceiptProps = {
  isLoading: boolean
  isError: boolean
  salaries: TSalary[] | undefined
  setStep: (step: number) => void
}

export const Receipt = ({
  isLoading,
  isError,
  salaries,
  setStep
}: TReceiptProps) => {
  const company = useAppStore((state) => state.company)
  const employee = useAppStore(
    (state) => state.employees.find(({ id }) => id === state.employeeId) ?? null
  )
  const createReceipt = useAppStore((state) => state.createReceipt)
  const { alert } = useAlertStore()

  const [option, setOption] = useState(0)
  const [date, setDate] = useState(currentDate)
  const [endDate, setEndDate] = useState(getEndDate(currentDate))
  const [period, setPeriod] = useState(getPeriod(date, endDate))
  const [salary, setSalary] = useState(salaries?.[0]?.salary ?? 0)
  const [oneThird, setOneThird] = useState(getOneThird(salary))
  const [proportionalOneThird, setProportionalOneThird] = useState(
    getProportionalOneThird(salary, 1)
  )
  const [netValue, setNetValue] = useState(
    getNetValue({ salary, oneThird, months: 1 })
  )
  const [proportionalNetValue, setProportionalNetValue] = useState(
    getProportionalNetValue({ salary, months: 1 })
  )
  const [isLocked, setIsLocked] = useState(false)

  const numberOfMonths = getNumberOfMonths(date, endDate)
  const updatedNetValue = getNetValue({
    salary,
    oneThird,
    months: numberOfMonths
  })
  const updatedProportionalNetValue = getProportionalNetValue({
    salary,
    months: numberOfMonths
  })
  const updatedProportionalVacationNetValue =
    proportionalNetValue + proportionalOneThird

  useEffect(() => {
    if (!salaries || isLocked) return
    const yearMonth = getYearMonth(date)
    setSalary(
      salaries.find(({ yearMonth: ym }) => ym === yearMonth)?.salary || 0
    )
  }, [date, salaries, isLocked])

  useEffect(() => {
    const endDate = getEndDate(date)
    setEndDate(endDate)
    setPeriod(getPeriod(date, endDate))
  }, [date])

  useEffect(() => {
    setPeriod(getPeriod(date, endDate))
    setNetValue(updatedNetValue)
    setProportionalNetValue(updatedProportionalNetValue)
  }, [date, endDate, updatedNetValue, updatedProportionalNetValue])

  useEffect(() => {
    const oneThird = getOneThird(salary)
    setOneThird(oneThird)
    setProportionalOneThird(getProportionalOneThird(salary, numberOfMonths))
    setNetValue(updatedNetValue)
    setProportionalNetValue(updatedProportionalNetValue)
  }, [salary, updatedNetValue, updatedProportionalNetValue, numberOfMonths])

  useEffect(() => {
    if (isError) {
      alert({
        severity: 'error',
        title: 'Ocorreu um erro ao carregar os dados'
      })
    }
  }, [isError, alert])

  const handleOptionChange = (e: SelectChangeEvent<unknown>) => {
    setOption(Number(e.target.value))
  }

  const handleDateChange = (e: Dayjs) => {
    setDate(e.format('YYYY-MM-DD'))
  }

  const handleEndDateChange = (e: Dayjs) => {
    setEndDate(e.format('YYYY-MM-DD'))
  }

  const handlePeriodChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPeriod(e.target.value)
  }

  const handleSalaryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSalary(formatCurrencyToNumber(e.target.value))
  }

  const handleOneThirdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOneThird(formatCurrencyToNumber(e.target.value))
  }

  const handleProportionalOneThirdChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setProportionalOneThird(formatCurrencyToNumber(e.target.value))
  }

  const handleNetValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNetValue(formatCurrencyToNumber(e.target.value))
  }

  const handleProportionalNetValueChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setProportionalNetValue(formatCurrencyToNumber(e.target.value))
  }

  const handleProportionalVacationNetValueChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setProportionalNetValue(
      formatCurrencyToNumber(e.target.value) - proportionalOneThird
    )
  }

  const handleLockClick = () => {
    setIsLocked(!isLocked)
  }

  const components: {
    type: TReceiptType
    title: string
    schema: { validate: (data: TReceiptData) => Promise<unknown> }
    data: TReceiptData
    component: React.ReactNode
  }[] = [
    {
      type: 'salary',
      schema: salaryOrThirteenthSchema,
      data: { salary, date },
      title: 'Recibo de Salário',
      component: (
        <SalaryOrThirteenth
          date={date}
          salary={salary}
          isLocked={isLocked}
          handleDateChange={handleDateChange}
          handleSalaryChange={handleSalaryChange}
          handleLockClick={handleLockClick}
        />
      )
    },
    {
      type: 'vacation',
      schema: vacationSchema,
      data: { date, endDate, period, salary, oneThird, netValue },
      title: 'Recibo de Férias',
      component: (
        <Vacation
          date={date}
          endDate={endDate}
          period={period}
          salary={salary}
          oneThird={oneThird}
          netValue={netValue}
          isLocked={isLocked}
          handleDateChange={handleDateChange}
          handleEndDateChange={handleEndDateChange}
          handlePeriodChange={handlePeriodChange}
          handleSalaryChange={handleSalaryChange}
          handleOneThirdChange={handleOneThirdChange}
          handleNetValueChange={handleNetValueChange}
          handleLockClick={handleLockClick}
        />
      )
    },
    {
      type: 'proportional-vacation',
      schema: proportionalVacationSchema,
      data: {
        date,
        endDate,
        period,
        salary,
        proportionalValue: proportionalNetValue,
        proportionalOneThird,
        proportionalNetValue: updatedProportionalVacationNetValue
      },
      title: 'Recibo de Férias Proporcionais',
      component: (
        <ProportionalVacation
          date={date}
          endDate={endDate}
          period={period}
          salary={salary}
          proportionalValue={proportionalNetValue}
          proportionalOneThird={proportionalOneThird}
          proportionalNetValue={updatedProportionalVacationNetValue}
          isLocked={isLocked}
          handleDateChange={handleDateChange}
          handleEndDateChange={handleEndDateChange}
          handlePeriodChange={handlePeriodChange}
          handleSalaryChange={handleSalaryChange}
          handleProportionalValueChange={handleProportionalNetValueChange}
          handleProportionalOneThirdChange={handleProportionalOneThirdChange}
          handleProportionalNetValueChange={
            handleProportionalVacationNetValueChange
          }
          handleLockClick={handleLockClick}
        />
      )
    },
    {
      type: 'thirteenth-salary',
      schema: salaryOrThirteenthSchema,
      data: { salary, date },
      title: 'Recibo de Décimo Terceiro',
      component: (
        <SalaryOrThirteenth
          date={date}
          salary={salary}
          isLocked={isLocked}
          handleDateChange={handleDateChange}
          handleSalaryChange={handleSalaryChange}
          handleLockClick={handleLockClick}
        />
      )
    },
    {
      type: 'proportional-thirteenth',
      schema: proportionalThirteenthSchema,
      data: { date, endDate, period, salary, proportionalNetValue },
      title: 'Recibo de Décimo Terceiro Proporcional',
      component: (
        <ProportionalThirteenth
          date={date}
          endDate={endDate}
          period={period}
          salary={salary}
          proportionalNetValue={proportionalNetValue}
          isLocked={isLocked}
          handleDateChange={handleDateChange}
          handleEndDateChange={handleEndDateChange}
          handlePeriodChange={handlePeriodChange}
          handleSalaryChange={handleSalaryChange}
          handleProportionalNetValueChange={handleProportionalNetValueChange}
          handleLockClick={handleLockClick}
        />
      )
    }
  ]

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!company) {
      alert({
        severity: 'error',
        title: 'Dados da empresa não encontrados',
        description: 'Preencha e salve os dados da empresa na página Empresa'
      })
      return
    }
    if (!employee) {
      alert({
        severity: 'error',
        title: 'Nenhum funcionário selecionado',
        description: 'Selecione ou cadastre um funcionário'
      })
      return
    }
    const { type, title, schema, data } = components[option]
    schema
      .validate(data)
      .then(() => {
        const receipt = {
          employeeId: employee.id,
          type,
          title,
          company: omitMetadata(company),
          employee: omitMetadata(employee),
          data
        }
        createReceipt(receipt)
        // Abre o PDF de forma síncrona após o clique (sem aguardar o banco)
        // para que o navegador não bloqueie a nova janela.
        openReceiptPdf(receipt)
      })
      .catch((error: ValidationError) => {
        alert({
          severity: 'error',
          title: 'Erro ao gerar o recibo',
          description: error.message
        })
      })
  }

  return (
    <StepLayout activeStep={1} handleSubmit={handleSubmit} setStep={setStep}>
      <FormControl fullWidth>
        <InputLabel id="receipt-type-label">Tipo de recibo</InputLabel>
        <Select
          labelId="receipt-type-label"
          label="Tipo de recibo"
          items={selectItems}
          value={option}
          onChange={handleOptionChange}
          sx={{ mb: 2 }}
        />
      </FormControl>
      {components[option]?.component || null}
      <Loader open={isLoading} />
    </StepLayout>
  )
}
