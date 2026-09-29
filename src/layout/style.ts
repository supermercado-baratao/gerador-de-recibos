import { SxProps, Theme } from '@mui/material'

export const Title: SxProps<Theme> = {
  flexGrow: 1,
  fontWeight: 'bold'
}

export const Nav: SxProps<Theme> = {
  display: 'flex',
  gap: 0.5
}

export const NavButton = (isActive: boolean): SxProps<Theme> => ({
  color: 'inherit',
  opacity: isActive ? 1 : 0.7,
  borderBottom: 2,
  borderColor: isActive ? 'primary.main' : 'transparent',
  borderRadius: 0
})

export const Content: SxProps<Theme> = {
  p: 2
}
