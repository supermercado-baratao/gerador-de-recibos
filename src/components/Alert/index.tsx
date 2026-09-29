import { Close } from '@mui/icons-material'
import {
  Alert as MUIAlert,
  AlertTitle,
  IconButton,
  Snackbar
} from '@mui/material'

import { useAlertStore } from '@/stores'

export const Alert = () => {
  const { params, clear } = useAlertStore()

  return (
    <Snackbar
      open={!!params}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      autoHideDuration={params?.autoHideDuration || 4000}
      onClose={clear}
    >
      <MUIAlert
        severity={params?.severity}
        action={
          <IconButton size="small" onClick={clear}>
            <Close fontSize="inherit" />
          </IconButton>
        }
      >
        <AlertTitle>{params?.title}</AlertTitle>
        {params?.description}
      </MUIAlert>
    </Snackbar>
  )
}
