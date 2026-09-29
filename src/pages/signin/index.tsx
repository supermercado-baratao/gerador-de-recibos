import {
  Box,
  Button,
  Link as MUILink,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { Link as RouterLink } from 'react-router'

import { Loader } from '@/components'
import * as GS from '@/styles'

import { useFormHandler } from './use-form-handler'

export const Signin = () => {
  const { register, onSubmit, isSubmitting, errors } = useFormHandler()

  return (
    <Box sx={GS.AuthWrapper}>
      <Paper sx={GS.AuthCard}>
        <Typography component="h1" variant="h5" sx={GS.AuthTitle}>
          Entrar
        </Typography>
        <Box component="form" onSubmit={onSubmit} noValidate sx={GS.AuthForm}>
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
          <MUILink
            component={RouterLink}
            to="/forgot-password"
            variant="body2"
            sx={{ alignSelf: 'flex-end' }}
          >
            Esqueci minha senha
          </MUILink>
          <Button type="submit" variant="contained">
            Entrar
          </Button>
        </Box>
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          Não tem uma conta?{' '}
          <MUILink
            component={RouterLink}
            to="/signup"
            variant="body2"
            sx={{ fontWeight: 'bold' }}
          >
            Criar conta
          </MUILink>
        </Typography>
      </Paper>
      <Loader open={isSubmitting} />
    </Box>
  )
}
