import { Logout } from '@mui/icons-material'
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { signOut } from 'firebase/auth'
import { Outlet, useLocation, useNavigate } from 'react-router'

import { auth } from '@/infra'
import { useAppStore } from '@/stores'

import { navItems } from './nav-items'
import * as S from './style'

export const AppLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const isFetched = useAppStore((state) => state.isFetched)

  const handleSignOut = () => signOut(auth)

  return (
    <>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" component="span" sx={S.Title}>
            {isSmallScreen ? 'Recibos' : 'Gerador de Recibos'}
          </Typography>
          <Box component="nav" sx={S.Nav}>
            {navItems.map(({ label, path, icon: Icon }) => {
              const isActive = location.pathname === path
              return isSmallScreen ? (
                <Tooltip key={path} title={label}>
                  <IconButton
                    aria-label={label}
                    onClick={() => navigate(path)}
                    sx={S.NavButton(isActive)}
                  >
                    <Icon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Button
                  key={path}
                  startIcon={<Icon />}
                  onClick={() => navigate(path)}
                  sx={S.NavButton(isActive)}
                >
                  {label}
                </Button>
              )
            })}
            <Tooltip title="Sair">
              <IconButton
                aria-label="Sair"
                onClick={handleSignOut}
                color="inherit"
              >
                <Logout />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={S.Content}>
        {isFetched && <Outlet />}
      </Box>
    </>
  )
}
