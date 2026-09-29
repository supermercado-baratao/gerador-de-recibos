import { SxProps, Theme } from '@mui/material'

export const Fieldset: SxProps<Theme> = {
  m: 0,
  mb: 2,
  p: 0,
  pt: 1,
  px: 2,
  borderRadius: 1
}

export const Form: SxProps<Theme> = {
  '.MuiTextField-root': {
    mb: 2
  }
}

export const Page: SxProps<Theme> = {
  ...Form,
  maxWidth: 600,
  mx: 'auto'
}

export const AuthWrapper: SxProps<Theme> = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  p: 2
}

export const AuthCard: SxProps<Theme> = {
  p: 4,
  width: '100%',
  maxWidth: 420,
  display: 'flex',
  flexDirection: 'column',
  gap: 3
}

export const AuthForm: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2
}

export const AuthTitle: SxProps<Theme> = {
  fontWeight: 'bold',
  textAlign: 'center'
}

export const PageTitle: SxProps<Theme> = {
  '&::after': {
    content: '""',
    width: 60,
    height: 8,
    display: 'block',
    backgroundColor: 'primary.main'
  },
  mb: 3
}
