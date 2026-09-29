import { Box, Button, Typography } from '@mui/material'
import { FormProvider } from 'react-hook-form'

import { CompanyFields } from '@/components'
import * as GS from '@/styles'

import { useFormHandler } from './use-form-handler'

export const Company = () => {
  const { methods, onSubmit } = useFormHandler()

  return (
    <Box sx={GS.Page}>
      <Typography component="h1" variant="h5" sx={GS.PageTitle}>
        Empresa
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit} noValidate>
          <CompanyFields />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={!methods.formState.isDirty}
            >
              Salvar
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Box>
  )
}
