import {
  Box,
  Button,
  Link as MUILink,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { FormProvider } from 'react-hook-form'
import { Link as RouterLink } from 'react-router'

import { CompanyFields, Loader } from '@/components'
import * as GS from '@/styles'

import * as S from './style'
import { useFormHandler } from './use-form-handler'

export const Signup = () => {
  const { methods, onSubmit } = useFormHandler()
  const {
    register,
    formState: { errors, isSubmitting }
  } = methods

  return (
    <Box sx={GS.AuthWrapper}>
      <Paper sx={S.Card}>
        <Typography component="h1" variant="h5" sx={GS.AuthTitle}>
          Criar conta
        </Typography>
        <FormProvider {...methods}>
          <Box component="form" onSubmit={onSubmit} noValidate sx={GS.Form}>
            <Box component="fieldset" sx={GS.Fieldset}>
              <legend>Acesso</legend>
              <TextField
                label="E-mail"
                type="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
              />
              <TextField
                label="Senha"
                type="password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
              />
              <TextField
                label="Confirmar senha"
                type="password"
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                fullWidth
              />
            </Box>
            <Box component="fieldset" sx={GS.Fieldset}>
              <legend>Empresa</legend>
              <CompanyFields />
            </Box>
            <Button type="submit" variant="contained" size="large" fullWidth>
              Criar conta
            </Button>
          </Box>
        </FormProvider>
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          Já tem uma conta?{' '}
          <MUILink
            component={RouterLink}
            to="/signin"
            variant="body2"
            sx={{ fontWeight: 'bold' }}
          >
            Entrar
          </MUILink>
        </Typography>
      </Paper>
      <Loader open={isSubmitting} />
    </Box>
  )
}
