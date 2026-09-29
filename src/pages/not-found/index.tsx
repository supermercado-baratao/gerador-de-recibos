import { Box, Link as MUILink, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router'

import * as GS from '@/styles'

export const NotFound = () => (
  <Box sx={GS.AuthWrapper}>
    <Box sx={{ textAlign: 'center' }}>
      <Typography component="h1" variant="h5" gutterBottom>
        Página não encontrada
      </Typography>
      <MUILink component={RouterLink} to="/">
        Voltar para o início
      </MUILink>
    </Box>
  </Box>
)
