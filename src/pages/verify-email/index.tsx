import { MarkEmailReadOutlined } from '@mui/icons-material'
import { Box, Button, Paper, Typography } from '@mui/material'

import * as GS from '@/styles'

import * as S from './style'
import { usePageHandler } from './use-page-handler'

export const VerifyEmail = () => {
  const {
    user,
    cooldown,
    handleResendClick,
    handleLoginClick,
    handleLogoutClick
  } = usePageHandler()

  return (
    <Box sx={GS.AuthWrapper}>
      <Paper sx={S.Card}>
        <div>
          <MarkEmailReadOutlined sx={S.Icon} />
          <Typography component="h1" variant="h5" sx={GS.AuthTitle}>
            Verifique seu e-mail
          </Typography>
        </div>
        <Typography variant="body2" color="text.secondary">
          Enviamos um link de verificação para <strong>{user?.email}</strong>.
          Acesse sua caixa de entrada e clique no link para ativar sua conta.
        </Typography>
        <Box sx={S.Actions}>
          <Button variant="contained" onClick={handleLoginClick}>
            Já verifiquei, entrar
          </Button>
          <Button
            variant="outlined"
            disabled={cooldown > 0}
            onClick={handleResendClick}
          >
            {cooldown > 0
              ? `Reenviar e-mail (${cooldown}s)`
              : 'Reenviar e-mail'}
          </Button>
          <Button variant="text" onClick={handleLogoutClick}>
            Sair da conta
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
