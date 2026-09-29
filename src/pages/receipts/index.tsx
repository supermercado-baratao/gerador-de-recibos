import { PictureAsPdf } from '@mui/icons-material'
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'

import { Select } from '@/components'
import * as GS from '@/styles'
import { formatCurrency, formatDate } from '@/utils'

import * as S from './style'
import { ALL_EMPLOYEES, useReceiptsHandler } from './use-receipts-handler'
import { getReceiptAmount } from './utils'

export const Receipts = () => {
  const {
    filteredReceipts,
    hasReceipts,
    employeeFilter,
    employeeItems,
    handleEmployeeFilterChange,
    handleOpenClick
  } = useReceiptsHandler()

  return (
    <Box sx={S.Wrapper}>
      <Typography component="h1" variant="h5" sx={GS.PageTitle}>
        Recibos
      </Typography>
      {!hasReceipts ? (
        <Typography color="text.secondary">
          Você ainda não gerou nenhum recibo.
        </Typography>
      ) : (
        <>
          <FormControl fullWidth sx={S.Filter}>
            <InputLabel id="employee-filter-label" shrink>
              Funcionário
            </InputLabel>
            <Select
              labelId="employee-filter-label"
              label="Funcionário"
              notched
              displayEmpty
              items={[
                { name: 'Todos', value: ALL_EMPLOYEES },
                ...employeeItems
              ]}
              value={employeeFilter}
              onChange={handleEmployeeFilterChange}
            />
          </FormControl>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Emissão</TableCell>
                  <TableCell>Funcionário</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReceipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell>
                      {receipt.createdAt.toDate().toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>{receipt.employee.name}</TableCell>
                    <TableCell>{receipt.title}</TableCell>
                    <TableCell>{formatDate(receipt.data.date)}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(getReceiptAmount(receipt))}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Abrir PDF">
                        <IconButton
                          aria-label="Abrir PDF"
                          onClick={() => handleOpenClick(receipt)}
                        >
                          <PictureAsPdf />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  )
}
