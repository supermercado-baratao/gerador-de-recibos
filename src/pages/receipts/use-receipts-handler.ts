import { SelectChangeEvent } from '@mui/material'
import { useState } from 'react'

import type { TReceipt } from '@/models'
import { openReceiptPdf } from '@/pdf'
import { useAlertStore, useAppStore } from '@/stores'
import { omitMetadata } from '@/utils'

import { sortByNewest } from './utils'

export const ALL_EMPLOYEES = ''

export const useReceiptsHandler = () => {
  const receipts = useAppStore((state) => state.receipts)
  const employees = useAppStore((state) => state.employees)
  const deleteReceipt = useAppStore((state) => state.deleteReceipt)
  const { alert } = useAlertStore()

  const [employeeFilter, setEmployeeFilter] = useState(ALL_EMPLOYEES)
  const [receiptToDelete, setReceiptToDelete] = useState<TReceipt | null>(null)

  const filteredReceipts = sortByNewest(
    employeeFilter === ALL_EMPLOYEES
      ? receipts
      : receipts.filter(({ employeeId }) => employeeId === employeeFilter)
  )

  const employeeItems = [...employees]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ id, name }) => ({ name, value: id }))

  const handleEmployeeFilterChange = (e: SelectChangeEvent<unknown>) =>
    setEmployeeFilter(e.target.value as string)

  const handleOpenClick = async (receipt: TReceipt) => {
    try {
      await openReceiptPdf(omitMetadata(receipt))
    } catch {
      alert({
        severity: 'error',
        title: 'Erro ao abrir o recibo',
        description: 'Verifique se o navegador bloqueou a nova janela'
      })
    }
  }

  const handleDeleteClick = (receipt: TReceipt) => setReceiptToDelete(receipt)

  const handleDeleteDialogClose = () => setReceiptToDelete(null)

  const handleDeleteDialogConfirm = () => {
    if (!receiptToDelete) return
    deleteReceipt(receiptToDelete.id)
    setReceiptToDelete(null)
  }

  return {
    filteredReceipts,
    hasReceipts: receipts.length > 0,
    employeeFilter,
    employeeItems,
    handleEmployeeFilterChange,
    handleOpenClick,
    receiptToDelete,
    handleDeleteClick,
    handleDeleteDialogClose,
    handleDeleteDialogConfirm
  }
}
