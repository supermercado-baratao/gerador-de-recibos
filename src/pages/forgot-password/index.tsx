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

export const ForgotPassword = () => {
  const { register, onSubmit, errors, isSubmitting, sentTo } = useFormHandler()

  return (
    <Box sx={GS.AuthWrapper}>
      <Paper sx={GS.AuthCard}>
        <Typography component="h1" variant="h5" sx={GS.AuthTitle}>
          Recuperar senha
        </Typography>
        {sentTo ? (
          <Typography variant="body2" color="text.secondary">
            Se houver uma conta para <strong>{sentTo}</strong>, você receberá um
            e-mail com um link para redefinir a senha.
          </Typography>
        ) : (
          <Box component="form" onSubmit={onSubmit} noValidate sx={GS.AuthForm}>
            <Typography variant="body2" color="text.secondary">
              Informe o e-mail da sua conta para receber o link de redefinição.
            </Typography>
            <TextField
              label="E-mail"
              type="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />
            <Button type="submit" variant="contained">
              Enviar link
            </Button>
          </Box>
        )}
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          <MUILink
            component={RouterLink}
            to="/signin"
            variant="body2"
            sx={{ fontWeight: 'bold' }}
          >
            Voltar para o login
          </MUILink>
        </Typography>
      </Paper>
      <Loader open={isSubmitting} />
    </Box>
  )
}
