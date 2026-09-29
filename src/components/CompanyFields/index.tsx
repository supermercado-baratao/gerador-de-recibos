import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  TextField
} from '@mui/material'
import { useEffect } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { InputMask, Select } from '@/components'
import { useAlertStore } from '@/stores'
import * as GS from '@/styles'

import type { TCompanyForm } from './schema'
import * as S from './styles'
import { useLoadData } from './use-load-data'

export const CompanyFields = () => {
  const {
    register,
    control,
    setValue,
    formState: { errors }
  } = useFormContext<TCompanyForm>()
  const { alert } = useAlertStore()

  const uf = useWatch({ control, name: 'uf' })

  const { cities, ufs, isError } = useLoadData({ acronym: uf || undefined })

  useEffect(() => {
    if (isError) {
      alert({ title: 'Erro ao carregar estados e cidades', severity: 'error' })
    }
  }, [isError, alert])

  return (
    <>
      <FormControl fullWidth>
        <TextField
          label="Nome da Empresa"
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register('name')}
        />
        <Controller
          control={control}
          name="cnpj"
          render={({ field }) => (
            <InputMask
              {...field}
              label="CNPJ"
              format="##.###.###/####-##"
              error={!!errors.cnpj}
              helperText={errors.cnpj?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="tel"
          render={({ field }) => (
            <InputMask
              {...field}
              type="tel"
              label="Telefone"
              format="(##) ####-####"
              error={!!errors.tel}
              helperText={errors.tel?.message}
            />
          )}
        />
      </FormControl>
      <Box component="fieldset" sx={GS.Fieldset}>
        <legend>Endereço</legend>
        <FormControl fullWidth>
          <TextField
            label="Logradouro"
            error={!!errors.street}
            helperText={errors.street?.message}
            {...register('street')}
          />
          <TextField
            type="number"
            label="Número"
            error={!!errors.num}
            helperText={errors.num?.message}
            {...register('num')}
          />
          <TextField
            label="Bairro"
            error={!!errors.district}
            helperText={errors.district?.message}
            {...register('district')}
          />
        </FormControl>
        <Controller
          control={control}
          name="uf"
          render={({ field }) => (
            <FormControl fullWidth sx={S.Select} error={!!errors.uf}>
              <InputLabel id="uf-label">Estado</InputLabel>
              <Select
                labelId="uf-label"
                label="Estado"
                items={(ufs ?? []).map(({ acronym, name }) => ({
                  name,
                  value: acronym
                }))}
                value={ufs ? field.value : ''}
                onChange={(e) => {
                  field.onChange(e.target.value)
                  setValue('city', '')
                }}
              />
              <FormHelperText>{errors.uf?.message}</FormHelperText>
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="city"
          render={({ field }) => (
            <FormControl fullWidth sx={S.Select} error={!!errors.city}>
              <InputLabel id="city-label">Cidade</InputLabel>
              <Select
                labelId="city-label"
                label="Cidade"
                items={(cities ?? []).map((city) => ({
                  name: city,
                  value: city
                }))}
                value={cities ? field.value : ''}
                onChange={(e) => field.onChange(e.target.value)}
                disabled={!cities}
              />
              <FormHelperText>{errors.city?.message}</FormHelperText>
            </FormControl>
          )}
        />
      </Box>
    </>
  )
}
