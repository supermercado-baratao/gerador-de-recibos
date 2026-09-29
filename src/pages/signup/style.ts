import { SxProps, Theme } from '@mui/material'

import * as GS from '@/styles'

export const Card: SxProps<Theme> = {
  ...GS.AuthCard,
  maxWidth: 600
}
