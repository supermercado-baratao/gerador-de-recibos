import { yupResolver } from '@hookform/resolvers/yup'
import { Delete } from '@mui/icons-material'
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  SelectChangeEvent,
  TextField,
  Tooltip
} from '@mui/material'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { DeleteDialog, InputMask, Select, StepLayout } from '@/components'
import type { TEmployee } from '@/models'
import { useAlertStore, useAppStore, useCallbackStore } from '@/stores'
import type { TCreateData } from '@/types'
import { hasChanges } from '@/utils'

import { InputRg } from './InputRg'
import { schema } from './schema'
import * as S from './styles'

type TEmployeeData = TCreateData<TEmployee>

type TFormProps = {
  employee: TEmployee | null
  setStep: (step: number) => void
}

const NEW_EMPLOYEE = ''

const getDefaultValues = (employee: TEmployee | null): TEmployeeData => ({
  name: employee?.name ?? '',
  rg: employee?.rg ?? '',
  cpf: employee?.cpf ?? ''
})

export const Form = ({ employee, setStep }: TFormProps) => {
  const {
    employees,
    setEmployeeId,
    createEmployee,
    updateEmployee,
    deleteEmployee
  } = useAppStore()
  const { setSuccessCallbacks } = useCallbackStore()
  const { alert } = useAlertStore()

  const [defaultValues] = useState(() => getDefaultValues(employee))

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const {
    formState: { errors },
    handleSubmit,
    register,
    control
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  })

  const employeeItems = [...employees]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ id, name }) => ({ name, value: id }))

  const handleEmployeeChange = (e: SelectChangeEvent<unknown>) => {
    const id = e.target.value as string
    setEmployeeId(id === NEW_EMPLOYEE ? null : id)
  }

  const handleDeleteDialogOpen = () => setIsDeleteDialogOpen(true)

  const handleDeleteDialogClose = () => setIsDeleteDialogOpen(false)

  const handleDeleteDialogConfirm = () => {
    if (!employee) return
    setSuccessCallbacks([() => setEmployeeId(null)])
    deleteEmployee(employee.id)
    setIsDeleteDialogOpen(false)
  }

  const onSubmit = (data: TEmployeeData) => {
    const isDuplicatedCpf = employees.some(
      ({ id, cpf }) => cpf === data.cpf && id !== employee?.id
    )
    if (isDuplicatedCpf) {
      alert({
        severity: 'error',
        title: 'Já existe um funcionário com este CPF'
      })
      return
    }

    if (employee) {
      if (!hasChanges(employee, data)) {
        setStep(1)
        return
      }
      setSuccessCallbacks([() => setStep(1)])
      updateEmployee({ ...employee, ...data })
      return
    }

    createEmployee(data, {
      onSuccess: ({ id }) => {
        setEmployeeId(id)
        setStep(1)
      }
    })
  }

  return (
    <StepLayout
      activeStep={0}
      handleSubmit={handleSubmit(onSubmit)}
      setStep={setStep}
    >
      <Box sx={S.EmployeeSelect}>
        <FormControl fullWidth>
          <InputLabel id="employee-label" shrink>
            Funcionário
          </InputLabel>
          <Select
            labelId="employee-label"
            label="Funcionário"
            notched
            items={[
              { name: 'Novo funcionário', value: NEW_EMPLOYEE },
              ...employeeItems
            ]}
            value={employee?.id ?? NEW_EMPLOYEE}
            displayEmpty
            onChange={handleEmployeeChange}
          />
        </FormControl>
        {employee && (
          <Tooltip title="Excluir funcionário">
            <IconButton onClick={handleDeleteDialogOpen} color="error">
              <Delete />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <FormControl fullWidth>
        <TextField
          label="Nome Completo"
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register('name')}
        />
        <Controller
          control={control}
          name="rg"
          render={({ field }) => (
            <InputRg
              {...field}
              label="RG"
              error={!!errors.rg}
              helperText={errors.rg?.message}
            />
          )}
        />
        <InputMask
          label="CPF"
          format="###.###.###-##"
          error={!!errors.cpf}
          helperText={errors.cpf?.message}
          defaultValue={defaultValues.cpf}
          {...register('cpf')}
        />
      </FormControl>
      {employee && (
        <DeleteDialog
          open={isDeleteDialogOpen}
          title="Excluir funcionário"
          item={employee.name}
          handleClose={handleDeleteDialogClose}
          handleConfirm={handleDeleteDialogConfirm}
        />
      )}
    </StepLayout>
  )
}
