import { SxProps, Theme } from '@mui/material'

import * as GS from '@/styles'

export const Card: SxProps<Theme> = {
  ...GS.AuthCard,
  alignItems: 'center',
  textAlign: 'center'
}

export const Icon: SxProps<Theme> = {
  fontSize: 56,
  color: 'primary.main'
}

export const Actions: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
  width: '100%',
  pt: 1
}
