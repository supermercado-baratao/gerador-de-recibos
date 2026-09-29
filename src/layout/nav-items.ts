import {
  Business,
  ReceiptLong,
  RequestPage,
  type SvgIconComponent
} from '@mui/icons-material'

type TNavItem = {
  label: string
  path: string
  icon: SvgIconComponent
}

export const navItems: TNavItem[] = [
  { label: 'Gerar recibo', path: '/', icon: RequestPage },
  { label: 'Recibos', path: '/receipts', icon: ReceiptLong },
  { label: 'Empresa', path: '/company', icon: Business }
]
